import TripPresenter from '../presenter/trip-presenter.js';
import FilterView from './view/filter-view.js';
import {render} from './render.js';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');
const tripControlFilters = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter({
  tripEventsContainer: tripEventsElement
});

render(new FilterView(), tripControlFilters);

tripPresenter.init();
