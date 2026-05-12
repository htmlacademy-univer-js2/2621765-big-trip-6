import SortView from '../src/view/sort-view.js';
import { render } from '../src/framework/render.js';
import EmptyListView from '../src/view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../src/const.js';
import dayjs from 'dayjs';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #newPointButton = null;

  #sortComponent = null;
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sortedPoints = [];

  #isNewPointCreating = false;

  constructor({
    tripEventsContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    newPointButton
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointButton = newPointButton;

    this.#pointsModel.addObserver(this.#handleModelEvent.bind(this));
    this.#filterModel.addObserver(this.#handleFilterChange.bind(this));
    this.#newPointButton.addEventListener('click', this.#onNewPointClick);
  }

  init() {
    this.#renderBoard();
  }

  #handleModelEvent() {
    this.#renderBoard();
  }

  #handleFilterChange() {
    this.#currentSortType = SortType.DAY;
    this.#renderBoard();
  }

  #handleUserAction = (actionType, updateType, updatedPoint) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, updatedPoint);
        this.#isNewPointCreating = false;
        break;
      case UserAction.DELETE_POINT:
        if (this.#isNewPointCreating && this.#pointsPresenter.has(updatedPoint.id)) {
          this.#pointsPresenter.delete(updatedPoint.id);
          this.#isNewPointCreating = false;
          this.#renderBoard();
          return;
        }
        this.#pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  #handleDataChange = (actionType, updateType, updatedPoint) => {
    this.#handleUserAction(actionType, updateType, updatedPoint);
  };

  #getEmptyPoint() {
    const firstDestination = this.#destinationsModel.getDestinations()[0];
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      basePrice: 0,
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
      destination: firstDestination?.id || '',
      isFavorite: false,
      offers: [],
      type: 'flight',
    };
  }

  #createPointForAdd(point) {
    this.#isNewPointCreating = true;
    const destination = this.#destinationsModel.getDestinationsById(point.destination);
    const offers = this.#offersModel.getOffersById(point.type, point.offers);

    const newPointPresenter = new PointPresenter({
      pointListContainer: this.#tripEventsContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange,
      isNew: true,
    });
    newPointPresenter.init(point, destination, offers);
    this.#pointsPresenter.set(point.id, newPointPresenter);
    newPointPresenter.openEditForm();
  }

  #onNewPointClick = () => {
    if (this.#isNewPointCreating){
      return;
    }

    this.#pointsPresenter.forEach((presenter) => presenter.resetView());

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;

    const newPoint = this.#getEmptyPoint();
    this.#createPointForAdd(newPoint);
  };

  #renderBoard() {
    this.#clearPoints();

    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = this.#filterModel.getFilteredPoints(allPoints);
    this.#tripEventsContainer.innerHTML = '';

    if (filteredPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#sortPoints(filteredPoints);
    this.#renderSort();
    render(this.#sortComponent, this.#tripEventsContainer);
    this.#renderPoints();
  }

  #renderEmptyList() {
    const message = this.#filterModel.getEmptyMessage();
    const emptyListView = new EmptyListView({ message });
    render(emptyListView, this.#tripEventsContainer);
  }

  #sortPoints(points) {
    const sorted = [...points];
    switch (this.#currentSortType) {
      case SortType.DAY:
        sorted.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
        break;
      case SortType.TIME:
        sorted.sort((a, b) => {
          const durA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
          const durB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
          return durB - durA;
        });
        break;
      case SortType.PRICE:
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        break;
    }
    this.#sortedPoints = sorted;
  }

  #renderPoints() {
    this.#sortedPoints.forEach((point) => {
      const destination = this.#destinationsModel.getDestinationsById(point.destination);
      const pointOffers = this.#offersModel.getOffersById(point.type, point.offers || []);
      this.#renderPoint(point, destination, pointOffers);
    });
  }

  #renderPoint(point, destination, offers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripEventsContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, destination, offers);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPoints() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }
    this.#currentSortType = sortType;

    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = this.#filterModel.getFilteredPoints(allPoints);
    this.#sortPoints(filteredPoints);
    this.#clearPoints();
    this.#renderPoints();
    if (this.#sortComponent) {
      this.#sortComponent.updateSortType(sortType);
    }
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
  }
}

