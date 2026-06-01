import he from 'he';
import { humanizeDateOnly, humanizeTime, calculateDuration } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';

const MAX_VISIBLE_OFFERS = 3;

function createPointTemplate(point, offers, destination) {
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

  const safeType = he.encode(String(type ?? ''));
  const safeDestinationName = he.encode(String(destinationName ?? ''));
  const safeBasePrice = he.encode(String(basePrice ?? 0));
  const safeDateFrom = dateFrom ? he.encode(String(dateFrom)) : '';
  const safeDateTo = dateTo ? he.encode(String(dateTo)) : '';

  const dateOnly = humanizeDateOnly(dateFrom);
  const timeStart = humanizeTime(dateFrom);
  const timeEnd = humanizeTime(dateTo);
  const duration = calculateDuration(dateFrom, dateTo);

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  const offersList = offers && offers.length > 0
    ? offers.slice(0, MAX_VISIBLE_OFFERS).map((offer) => {
      const safeTitle = he.encode(String(offer.title ?? ''));
      const safePrice = he.encode(String(offer.price ?? 0));
      return `
          <li class="event__offer">
            <span class="event__offer-title">${safeTitle}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${safePrice}</span>
          </li>
        `;
    }).join('')
    : '';

  const moreOffers = offers && offers.length > MAX_VISIBLE_OFFERS
    ? '<li class="event__offer">...</li>'
    : '';

  return `
    <div class="event">
      <time class="event__date" datetime="${safeDateFrom}">${dateOnly}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="./img/icons/${safeType}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${safeType} ${safeDestinationName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${safeDateFrom}">${timeStart}</time>
          &mdash;
          <time class="event__end-time" datetime="${safeDateTo}">${timeEnd}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${safeBasePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersList}
        ${moreOffers}
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
  `;
}

export default class PointView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #onOpenEditButtonClick = null;
  #onFavoriteClick = null;

  constructor({ point, offers, destination, onOpenEditButtonClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#offers = offers || [];
    this.#destination = destination || {};
    this.#onOpenEditButtonClick = onOpenEditButtonClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#setEventListeners();
  }

  get template() {
    return `<div class="trip-events__item">${createPointTemplate(this.#point, this.#offers, this.#destination)}</div>`;
  }

  #setEventListeners() {
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    const favoriteBtn = this.element.querySelector('.event__favorite-btn');

    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#openEditButtonClickHandler);
    }
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', this.#favoriteClickHandler);
    }
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onOpenEditButtonClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

  isRendered() {
    return this.element && this.element.parentElement !== null;
  }
}
