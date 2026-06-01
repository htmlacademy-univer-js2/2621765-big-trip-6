import { humanizePointDueDate } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

const ICON_MAP = {
  taxi: 'img/icons/taxi.png',
  bus: 'img/icons/bus.png',
  train: 'img/icons/train.png',
  flight: 'img/icons/flight.png',
  'check-in': 'img/icons/check-in.png',
  sightseeing: 'img/icons/sightseeing.png',
  ship: 'img/icons/ship.png',
  drive: 'img/icons/drive.png',
  restaurant: 'img/icons/restaurant.png',
};

const DEFAULT_ICON = 'img/icons/point.png';

function getIconByType(type) {
  return ICON_MAP[type] || DEFAULT_ICON;
}

function createNewFormTemplate(point, destinations, offersByType) {
  const {
    type = 'flight',
    destinationId = '',
    dateFrom = new Date().toISOString(),
    dateTo = new Date().toISOString(),
    basePrice = 0,
    offers = [],
  } = point;

  const destination = destinations.find((dest) => dest.id === destinationId) || {};
  const destinationName = he.encode(destination.name || '');
  const destinationDescription = he.encode(destination.description || '');
  const destinationPictures = destination.pictures || [];

  const dateStart = humanizePointDueDate(dateFrom);
  const dateEnd = humanizePointDueDate(dateTo);

  const safeDateStart = he.encode(dateStart || '');
  const safeDateEnd = he.encode(dateEnd || '');
  const safeType = he.encode(type);
  const safeBasePrice = Number(basePrice);

  const offersList = offersByType[type] || [];
  const offersHtml = offersList.length
    ? offersList.map((offer) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" id="offer-${he.encode(offer.id)}" type="checkbox" name="offer" value="${he.encode(offer.id)}" ${offers.includes(offer.id) ? 'checked' : ''}>
          <label class="event__offer-label" for="offer-${he.encode(offer.id)}">
            <span class="event__offer-title">${he.encode(offer.title)}</span>
            &nbsp;+&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `).join('')
    : '<p class="event__offer-empty">No additional offers</p>';

  const destinationsHtml = destinations.map((dest) => `<option value="${he.encode(dest.id)}">${he.encode(dest.name)}</option>`).join('');

  const typesHtml = Object.keys(ICON_MAP).map((t) => `
    <div class="event__type-item">
      <input id="event-type-${he.encode(t)}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${he.encode(t)}" ${t === safeType ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${he.encode(t)}" for="event-type-${he.encode(t)}-1">${he.encode(t)}</label>
    </div>
  `).join('');

  const picturesHtml = destinationPictures.map((pic) => `
    <img class="event__photo" src="${he.encode(pic.src)}" alt="${he.encode(pic.description)}">
  `).join('');

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${getIconByType(safeType)}" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesHtml}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">${safeType}</label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1" placeholder="Select destination">
          <datalist id="destination-list-1">
            ${destinationsHtml}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${safeDateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${safeDateEnd}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1"><span class="visually-hidden">Price</span>&euro;</label>
          <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" value="${safeBasePrice}" min="0">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <button class="event__delete-btn" type="button">Delete</button>
      </header>

      <section class="event__details">
        <section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersHtml}
          </div>
        </section>

        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDescription}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesHtml}
            </div>
          </div>
        </section>
      </section>
    </form>
  `;
}

export default class NewCreateFormView extends AbstractView {
  #point = null;
  #destinations = [];
  #offersByType = {};

  constructor({ point, destinations, offersByType }) {
    super();
    this.#point = point || {};
    this.#destinations = destinations || [];
    this.#offersByType = offersByType || {};
  }

  get template() {
    return createNewFormTemplate(this.#point, this.#destinations, this.#offersByType);
  }
}

