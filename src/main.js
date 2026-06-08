import '../public/css/style.css';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';

const AUTHORIZATION = 'Basic hS3sfS55wcl2sa8j';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripControlFilters = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);
const offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ pointsApiService });
const destinationsModel = new DestinationsModel({ destinationsApiService });
const offersModel = new OffersModel({ offersApiService });
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

tripPresenter.setLoading(true);

Promise.all([
  pointsModel.init(),
  destinationsModel.init(),
  offersModel.init(),
])
  .then(() => {
    tripPresenter.setLoading(false);
    filterPresenter.init();
    tripPresenter.init();
  })
  .catch(() => {
    tripPresenter.renderError();
  });
