import { humanizePointDueDate } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';

function createNewEditFormTemplate(point, allOffers, pointDestination, allDestinations) {
  const { type, basePrice, dateFrom, dateTo, offers: pointOffers = [] } = point;
  const { name, description, pictures } = pointDestination || {};
  const dateStart = humanizePointDueDate(dateFrom);
  const dateEnd = humanizePointDueDate(dateTo);


  const getIconByType = (iconType) => {
    const icons = {
      'taxi': 'img/icons/taxi.png',
      'bus': 'img/icons/bus.png',
      'train': 'img/icons/train.png',
      'flight': 'img/icons/flight.png',
      'check-in': 'img/icons/check-in.png',
      'sightseeing': 'img/icons/sightseeing.png',
      'ship': 'img/icons/ship.png',
      'drive': 'img/icons/drive.png',
      'restaurant': 'img/icons/restaurant.png'
    };

    return icons[iconType] || '/img/icons/transport.png';
  };

  const generateOffers = () => {
    if (!allOffers || !allOffers.offers || !allOffers.offers.length) {
      return '';
    }

    return allOffers.offers.map((offer) => {
      const isChecked = pointOffers.includes(offer.id);
      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${offer.id}-1"
            type="checkbox"
            name="event-offer-${offer.id}"
            ${isChecked ? 'checked' : ''}
          >
          <label class="event__offer-label" for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `;
    }).join('');
  };


  const generateDestinationsList = () =>
    allDestinations
      .map((dest) => `<option value="${dest.name}"></option>`)
      .join('');

  const generateEventTypes = () => {
    const eventTypes = [
      'taxi', 'bus', 'train', 'flight', 'check-in',
      'sightseeing', 'ship', 'drive', 'restaurant'
    ];

    return eventTypes.map((eventType) => `
      <div class="event__type-item">
        <input
          id="event-type-${eventType}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${eventType}"
          ${eventType === type ? 'checked' : ''}
        >
        <label
          class="event__type-label event__type-label--${eventType}"
          for="event-type-${eventType}-1"
        >
          ${eventType}
        </label>
      </div>
    `).join('');
  };


  const generatePhotos = () => {
    if (!pictures || !pictures.length) {
      return '';
    }

    return `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((pic) => `
            <img class="event__photo" src="${pic.src}" alt="${pic.description || 'Event photo'}">
          `).join('')}
        </div>
      </div>
    `;
  };

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="${getIconByType(type)}"
              alt="Event type icon"
            >
          </label>
          <input
            class="event__type-toggle visually-hidden"
            id="event-type-toggle-1"
            type="checkbox"
          >

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${generateEventTypes()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${name || ''}"
            list="destination-list-1"
            placeholder="Select destination"
          >
          <datalist id="destination-list-1">
            ${generateDestinationsList()}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${dateStart}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${dateEnd}"
          >
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input event__input--price"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${basePrice}"
            min="0"
          >
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${allOffers && allOffers.offers && allOffers.offers.length > 0 ? `
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${generateOffers()}
            </div>
          </section>
        ` : ''}

        ${description || pictures ? `
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description || ''}</p>
            ${generatePhotos()}
          </section>
        ` : ''}
      </section>
    </form>
  `;
}

export default class NewEditFormView extends AbstractView {
  #point = null;
  #allOffers = null;
  #pointDestination = null;
  #allDestinations = null;
  #onCloseEditButtonClick = null;
  #onSubmitButtonClick = null;

  #onSubmitForm = null;

  constructor({ point, allOffers, pointDestination, allDestinations,onCloseEditButtonClick,onSubmitButtonClick }) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
    this.#pointDestination = pointDestination;
    this.#allDestinations = allDestinations;
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onSubmitButtonClick = onSubmitButtonClick;
    this.#setEventListeners();
  }

  get template() {
    return createNewEditFormTemplate(
      this.#point,
      this.#allOffers,
      this.#pointDestination,
      this.#allDestinations
    );
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click',this.#closeEditButtonClickHandler);

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('submit',this.#submitEditButtonClickHandler);
  }

  #closeEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #submitEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitButtonClick();
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitForm(this.#point);
  };
}
