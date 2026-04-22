import SortView from '../src/view/sort-view.js';
import { render} from '../src/framework/render.js';
import EmptyListView from '../src/view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../src/util.js';
//import { sortTaskUp,sortTaskDown } from '../src/util.js';
import { SortType } from '../src/const.js';
import dayjs from 'dayjs';
export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #sortComponent = null;
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardTasks = [];

  constructor({ tripEventsContainer, pointsModel, destinationsModel, offersModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#points = [...this.#pointsModel.getPoints()];
  }

  init() {
    const points = [...this.#pointsModel.getPoints()];
    this.#sourcedBoardTasks = [...this.#pointsModel.getPoints()];

    this.#tripEventsContainer.innerHTML = '';

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderBoard();

    this.#renderPoints();
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points,updatedPoint);
    this.#sourcedBoardTasks = updateItem(this.#sourcedBoardTasks, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point, destination, offers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripEventsContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point, destination, offers);
    this.#pointsPresenter.set(point.id,pointPresenter);
  }

  #clearPointList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    const pointElements = this.#tripEventsContainer.querySelectorAll('.trip-events__item');
    pointElements.forEach((el) => el.remove());
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
        break;
      case SortType.TIME:
        this.#points.sort((a, b) => {
          const durA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
          const durB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
          return durB - durA;
        });
        break;
      case SortType.PRICE:
        this.#points.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        this.#points = [...this.#sourcedBoardTasks];
    }
    this.#currentSortType = sortType;
  }

  #renderPoints() {
    this.#points.forEach((point) => {
      const destination = this.#destinationsModel.getDestinationsById(point.destination);
      const pointOffers = this.#offersModel.getOffersById(point.type, point.offers || []);
      this.#renderPoint(point, destination, pointOffers);
    });
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPoints();
    this.#sortComponent.updateSortType(sortType);
  };

  #renderBoard() {
    this.#renderSort();
    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
  }

  #renderEmptyList() {
    const emptyListView = new EmptyListView();
    render(emptyListView, this.#tripEventsContainer);
  }
}

