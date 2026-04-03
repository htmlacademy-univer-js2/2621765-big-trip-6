import TripPresenter from '../presenter/trip-presenter.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from '../presenter/filter-presenter.js';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripControlFilters = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();


const filterPresenter = new FilterPresenter({
  container: tripControlFilters,
  pointsModel,
  onFilterChange: null
});


const tripPresenter = new TripPresenter({
  tripEventsContainer: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  getFilteredPoints: () => filterPresenter.getFilteredPoints()
});


filterPresenter.setOnFilterChange(() => tripPresenter.init());


filterPresenter.init();
tripPresenter.init();
