import SortView from '../src/view/sort-view.js';
import { render} from '../src/framework/render.js';
import EmptyListView from '../src/view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../src/util.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #pointsPresenter = new Map();

  constructor({ tripEventsContainer, pointsModel, destinationsModel, offersModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#points = [...this.#pointsModel.getPoints()];
  }

  init() {
    const points = [...this.#pointsModel.getPoints()];

    this.#tripEventsContainer.innerHTML = '';

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderBoard();

    points.forEach((point) => {

      const destination = this.#destinationsModel.getDestinationsById(point.destination);
      const pointOffers = this.#offersModel.getOffersById(point.type, point.offers || []);

      this.#renderPoint(point, destination, pointOffers);
    });
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points,updatedPoint);
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

  #renderBoard() {
    render(new SortView(), this.#tripEventsContainer);
  }

  #renderEmptyList() {
    const emptyListView = new EmptyListView();
    render(emptyListView, this.#tripEventsContainer);
  }
}

