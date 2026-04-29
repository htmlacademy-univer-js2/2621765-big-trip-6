import { humanizePointDueDate } from '../util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

function createNewEditFormTemplate(point, currentTypeOffers, allDestinations, currentDestination) {
  const { type, basePrice, dateFrom, dateTo, offers: selectedOfferIds = [] } = point;
  const { name, description, pictures } = currentDestination || {};
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
    return icons[iconType] || 'img/icons/transport.png';
  };

  const generateOffers = () => {
    if (!currentTypeOffers?.offers?.length) {
      return '';
    }
    return currentTypeOffers.offers.map((offer) => {
      const isChecked = selectedOfferIds.includes(offer.id);
      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden"
                 id="event-offer-${offer.id}-1"
                 type="checkbox"
                 name="event-offer-${offer.id}"
                 data-offer-id="${offer.id}"
                 ${isChecked ? 'checked' : ''}>
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
    allDestinations.map((dest) => `<option value="${dest.name}"></option>`).join('');

  const generateEventTypes = () => {
    const eventTypes = [
      'taxi', 'bus', 'train', 'flight', 'check-in',
      'sightseeing', 'ship', 'drive', 'restaurant'
    ];
    return eventTypes.map((eventType) => `
      <div class="event__type-item">
        <input id="event-type-${eventType}-1"
               class="event__type-input visually-hidden"
               type="radio"
               name="event-type"
               value="${eventType}"
               ${eventType === type ? 'checked' : ''}>
        <label class="event__type-label event__type-label--${eventType}"
               for="event-type-${eventType}-1">
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
            <img class="event__type-icon" width="17" height="17"
                 src="${getIconByType(type)}" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${generateEventTypes()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">${type}</label>
          <input class="event__input event__input--destination" id="event-destination-1"
                 type="text" name="event-destination" value="${name || ''}"
                 list="destination-list-1" placeholder="Select destination">
          <datalist id="destination-list-1">${generateDestinationsList()}</datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time" id="event-start-time-1"
                 type="text" name="event-start-time" value="${dateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time" id="event-end-time-1"
                 type="text" name="event-end-time" value="${dateEnd}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1"><span class="visually-hidden">Price</span>&euro;</label>
          <input class="event__input event__input--price" id="event-price-1"
                 type="number" name="event-price" value="${basePrice}" min="0">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${currentTypeOffers?.offers?.length ? `
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">${generateOffers()}</div>
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

export default class NewEditFormView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #handleFormSubmit = null;
  #handleEditRollUp = null;
  #datepickerStart = null;
  #datepickerEnd = null;


  constructor({ point, typeOffers, allOffers, allDestinations, onFormSubmit, onEditRollup }) {
    super();
    this._setState(NewEditFormView.parsePointToState(point, typeOffers));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditRollUp = onEditRollup;
    this._restoreHandlers();
  }

  get template() {
    const currentDestination = this.#allDestinations.find(
      (dest) => dest.id === this._state.destination
    ) || { name: '', description: '', pictures: [] };
    return createNewEditFormTemplate(
      this._state,
      this._state.typeOffers,
      this.#allDestinations,
      currentDestination
    );
  }

  reset(point) {
    const typeOffers = this.#allOffers.find((item) => item.type === point.type);
    const newState = NewEditFormView.parsePointToState(point, typeOffers);
    this.updateElement(newState);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#editRollUpHandler);
    this.element.querySelector('.event__type-group')
      ?.addEventListener('change', this.#typeListChangeHandler);
    this.element.querySelector('.event__input--destination')
      ?.addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      ?.addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(NewEditFormView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo,
      }
    );
  }

  #setDatepickerEnd() {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  }

  #editRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditRollUp(NewEditFormView.parseStateToPoint(this._state));
  };

  #typeListChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#allOffers.find((item) => item.type === targetType);
    this.updateElement({
      type: targetType,
      typeOffers: typeOffers,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const targetName = evt.target.value;
    const newDestination = this.#allDestinations.find((item) => item.name === targetName);
    if (newDestination) {
      this.updateElement({ destination: newDestination.id });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({ basePrice: evt.target.value });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }
    const offerId = evt.target.dataset.offerId;
    let updatedOffers = [...this._state.offers];
    if (evt.target.checked) {
      if (!updatedOffers.includes(offerId)) {
        updatedOffers.push(offerId);
      }
    } else {
      updatedOffers = updatedOffers.filter((id) => id !== offerId);
    }
    this.updateElement({ offers: updatedOffers });
  };

  static parsePointToState(point, typeOffers) {
    return {
      ...point,
      typeOffers: typeOffers,
      offers: point.offers || []
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.typeOffers;
    return point;
  }
}
