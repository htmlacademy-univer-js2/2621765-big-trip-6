import SortView from '../view/sort-view.js';
import { render, remove } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';
import ErrorView from '../view/error-view.js';

dayjs.extend(utc);

const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const DEFAULT_POINT_TYPE = 'flight';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #newPointButton = null;
  #tripMainElement = null;
  #tripInfoComponent = null;
  #sortComponent = null;
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sortedPoints = [];
  #errorComponent = null;

  #isNewPointCreating = false;
  #loadingComponent = null;
  #isLoading = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT
  });

  constructor({
    tripEventsContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    newPointButton,
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointButton = newPointButton;

    this.#pointsModel.addObserver(this.#handleModelEvent.bind(this));
    this.#destinationsModel.addObserver(this.#handleModelEvent.bind(this));
    this.#offersModel.addObserver(this.#handleModelEvent.bind(this));
    this.#filterModel.addObserver(this.#handleFilterChange.bind(this));
    this.#newPointButton.addEventListener('click', this.#handleNewPointClick);
    this.#tripMainElement = document.querySelector('.trip-main');
  }

  init() {
    this.#renderBoard();
    this.#renderTripInfo();
  }

  setLoading(isLoading) {
    this.#isLoading = isLoading;
    this.#renderBoard();
  }

  renderError() {
    this.#isLoading = false;
    this.#clearBoard();
    this.#clearLoading();
    this.#errorComponent = new ErrorView();
    render(this.#errorComponent, this.#tripEventsContainer);
  }

  #renderTripInfo() {
    const points = this.#pointsModel.getPoints();
    const destinations = this.#destinationsModel.getDestinations();
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }
    this.#tripInfoComponent = new TripInfoView({
      points,
      destinations,
      offersModel: this.#offersModel,
    });
    render(this.#tripInfoComponent, this.#tripMainElement, 'afterbegin');
  }

  #renderLoading() {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #clearLoading() {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
      this.#loadingComponent = null;
    }
  }

  #getEmptyPoint() {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      basePrice: 0,
      dateFrom: null,
      dateTo: null,
      destination: '',
      isFavorite: false,
      offers: [],
      type: DEFAULT_POINT_TYPE,
      isNew: true,
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
      onCancelCreate: (canceledPoint) => {
        this.#pointsPresenter.delete(canceledPoint.id);
        this.#isNewPointCreating = false;
      }
    });
    newPointPresenter.init(point, destination, offers);
    this.#pointsPresenter.set(point.id, newPointPresenter);
    newPointPresenter.openEditForm();
  }

  #renderBoard() {
    if (this.#errorComponent) {
      remove(this.#errorComponent);
      this.#errorComponent = null;
    }
    this.#clearLoading();
    this.#clearPoints();
    this.#tripEventsContainer.innerHTML = '';

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = this.#filterModel.getFilteredPoints(allPoints);

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
        sorted.sort((a, b) => dayjs.utc(a.dateFrom).diff(dayjs.utc(b.dateFrom)));
        break;
      case SortType.TIME:
        sorted.sort((a, b) => {
          const durA = dayjs.utc(a.dateTo).diff(dayjs.utc(a.dateFrom));
          const durB = dayjs.utc(b.dateTo).diff(dayjs.utc(b.dateFrom));
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

  #clearPoints() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
  }

  #clearBoard() {
    this.#tripEventsContainer.innerHTML = '';
  }

  #handleModelEvent() {
    if (this.#isLoading) {
      return;
    }
    this.#renderBoard();
    this.#renderTripInfo();
  }

  #handleFilterChange() {
    this.#currentSortType = SortType.DAY;
    this.#renderBoard();
  }

  #handleUserAction = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();
    let pointPresenter = null;

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          pointPresenter = this.#pointsPresenter.get(updatedPoint.id);
          pointPresenter?.setSaving();
          await this.#pointsModel.updatePoint(updateType, updatedPoint);
          break;

        case UserAction.ADD_POINT:
          pointPresenter = this.#pointsPresenter.get(updatedPoint.id);
          pointPresenter?.setSaving();
          await this.#pointsModel.addPoint(updateType, updatedPoint);
          break;

        case UserAction.DELETE_POINT:
          if (this.#isNewPointCreating && this.#pointsPresenter.has(updatedPoint.id)) {
            this.#pointsPresenter.delete(updatedPoint.id);
            this.#isNewPointCreating = false;
            this.#renderBoard();
            return;
          }
          pointPresenter = this.#pointsPresenter.get(updatedPoint.id);
          pointPresenter?.setDeleting();
          await this.#pointsModel.deletePoint(updateType, updatedPoint);
          break;
      }
    } catch (err) {
      if (pointPresenter) {
        pointPresenter.setAborting();
      }
    } finally {
      this.#isNewPointCreating = false;
      this.#uiBlocker.unblock();
    }
  };

  #handleDataChange = (actionType, updateType, updatedPoint) => {
    this.#handleUserAction(actionType, updateType, updatedPoint);
  };

  #handleNewPointClick = () => {
    if (this.#isNewPointCreating) {
      return;
    }

    this.#pointsPresenter.forEach((presenter) => presenter.resetView());

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;

    this.#renderBoard();

    const newPoint = this.#getEmptyPoint();
    this.#createPointForAdd(newPoint);
  };

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
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
}
