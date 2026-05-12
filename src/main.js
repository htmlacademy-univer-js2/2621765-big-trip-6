import TripPresenter from '../presenter/trip-presenter.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from '../presenter/filter-presenter.js';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripControlFilters = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripEventsContainer: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  newPointButton: newEventButton,
});

const filterPresenter = new FilterPresenter({
  container: tripControlFilters,
  filterModel,
  pointsModel,
});

filterPresenter.init();
tripPresenter.init();
