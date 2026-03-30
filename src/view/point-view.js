import {
  humanizeDateOnly,
  humanizeTime,
  calculateDuration
} from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';

const createPointTemplate = (point, offers, destination) => {
  if (!point) {
    return '<li class="trip-events__item">Error loading point</li>';
  }

  const {
    type = 'flight',
    basePrice = 0,
    dateFrom,
    dateTo,
    isFavorite = false
  } = point;

  const destinationName = destination?.name || '';

  const dateOnly = humanizeDateOnly(dateFrom);
  const timeStart = humanizeTime(dateFrom);
  const timeEnd = humanizeTime(dateTo);
  const duration = calculateDuration(dateFrom, dateTo);

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  const offersList = offers && offers.length > 0
    ? offers.slice(0, 3).map((offer) => `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `).join('')
    : '';

  return `
  <ul class="trip-events__list">
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom || ''}">${dateOnly}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="/img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom || ''}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo || ''}">${timeEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersList}
          ${offers && offers.length > 3 ? '<li class="event__offer">...</li>' : ''}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.228 4.326 1.571-9.162L.685 9.674l9.221-1.34L14 0l4.094 8.334 9.221 1.34-6.658 6.49 1.571 9.162z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  </ul>
  `;
};

export default class PointView extends AbstractView{
  #point = null;
  #offers = null;
  #destination = null;
  #onOpenEditButtonClick = null;
  constructor({ point, offers, destination,onOpenEditButtonClick }) {
    super();
    this.#point = point;
    this.#offers = offers || [];
    this.#destination = destination || {};
    this.#onOpenEditButtonClick = onOpenEditButtonClick;
    this.#setEventListeners();
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click',this.#openEditButtonClickHandler);
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onOpenEditButtonClick();
  };
}
