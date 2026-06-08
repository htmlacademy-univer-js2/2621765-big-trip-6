import he from 'he';
import { humanizePointDueDate } from '../util.js';
import { generateOffersHTML, generateEventTypesHTML } from '../util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

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

const DEFAULT_ICON = 'img/icons/transport.png';
const SHAKE_ANIMATION_DURATION = 500;

function getIconByType(type) {
  return ICON_MAP[type] || DEFAULT_ICON;
}

function createNewEditFormTemplate(point, currentTypeOffers, allDestinations, currentDestination, isDisabled, isSaving, isDeleting, isNew) {
  const { type, basePrice, dateFrom, dateTo, offers: selectedOfferIds = [] } = point;
  const { description, pictures } = currentDestination || {};
  const dateStart = dateFrom ? humanizePointDueDate(dateFrom) : '';
  const dateEnd = dateTo ? humanizePointDueDate(dateTo) : '';
  const resetButtonText = isNew ? 'Cancel' : 'Delete';

  const generatePhotos = () => {
    if (!pictures?.length){
      return '';
    }
    return `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((picture) => {
    const safeSrc = he.encode(picture.src);
    const safeAlt = picture.description ? he.encode(picture.description) : 'Event photo';
    return `<img class="event__photo" src="${safeSrc}" alt="${safeAlt}">`;
  }).join('')}
        </div>
      </div>
    `;
  };

  const offersHtml = generateOffersHTML(currentTypeOffers?.offers || [], selectedOfferIds, isDisabled);
  const typesHtml = generateEventTypesHTML(type, isDisabled);

  const destinationsDatalist = `
    <datalist id="destination-list-1">
      ${allDestinations.map((item) => `<option value="${he.encode(item.name)}"></option>`).join('')}
    </datalist>
  `;
  const currentDestinationName = currentDestination?.name ? he.encode(currentDestination.name) : '';

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${getIconByType(type)}" alt="Event type icon">
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
          <label class="event__label event__type-output" for="event-destination-1">${he.encode(type)}</label>
          <input class="event__input event__input--destination" id="event-destination-1"
                 type="text" name="event-destination" list="destination-list-1"
                 value="${currentDestinationName}"
                 placeholder="Select destination" ${isDisabled ? 'disabled' : ''}>
          ${destinationsDatalist}
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time" id="event-start-time-1"
                 type="text" name="event-start-time" value="${he.encode(dateStart)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time" id="event-end-time-1"
                 type="text" name="event-end-time" value="${he.encode(dateEnd)}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1"><span class="visually-hidden">Price</span>&euro;</label>
          <input class="event__input event__input--price" id="event-price-1"
                 type="number" name="event-price" value="${basePrice}" min="0">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : resetButtonText}</button>
        ${!isNew ? `
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
        ` : ''}
      </header>

      <section class="event__details">
        ${currentTypeOffers?.offers?.length ? `
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">${offersHtml}</div>
          </section>
        ` : ''}

        ${description || pictures?.length ? `
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${he.encode(description || '')}</p>
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
  #handleDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({ point, typeOffers, allOffers, allDestinations, onFormSubmit, onEditRollup, onDeleteClick }) {
    super();
    this._setState(NewEditFormView.parsePointToState(point, typeOffers));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditRollUp = onEditRollup;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    const currentDestination = this.#allDestinations.find(
      (destination) => destination.id === this._state.destination
    ) || { name: '', description: '', pictures: [] };
    return createNewEditFormTemplate(
      this._state,
      this._state.typeOffers,
      this.#allDestinations,
      currentDestination,
      this._state.isDisabled,
      this._state.isSaving,
      this._state.isDeleting,
      this._state.isNew,
    );
  }

  reset(point) {
    const typeOffers = this.#allOffers.find((item) => item.type === point.type);
    const newState = NewEditFormView.parsePointToState(point, typeOffers);
    this.updateElement(newState);
  }

  shake() {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_DURATION / 1000}s ease-in-out`;
    setTimeout(() => {
      this.element.style.animation = '';
    }, SHAKE_ANIMATION_DURATION);
  }

  _afterUpdateElement() {
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#editRollUpHandler);
    this.element.querySelector('.event__reset-btn')
      ?.addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__type-group')
      ?.addEventListener('change', this.#typeListChangeHandler);
    this.element.querySelector('.event__input--destination')
      ?.addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      ?.addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #updateDatepickersConstraints() {
    if (this.#datepickerStart) {
      const maxDate = this._state.dateTo ? new Date(this._state.dateTo) : null;
      this.#datepickerStart.set('maxDate', maxDate);
    }
    if (this.#datepickerEnd) {
      const minDate = this._state.dateFrom ? new Date(this._state.dateFrom) : null;
      this.#datepickerEnd.set('minDate', minDate);
    }
  }

  #setDatepickerStart() {
    const startInput = this.element.querySelector('#event-start-time-1');
    if (!startInput){
      return;
    }
    const defaultDate = this._state.dateFrom ? new Date(this._state.dateFrom) : undefined;
    this.#datepickerStart = flatpickr(startInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      defaultDate: defaultDate,
      onChange: this.#dateFromChangeHandler,
      maxDate: this._state.dateTo ? new Date(this._state.dateTo) : null,
    });
    if (!this._state.dateFrom) {
      this.#datepickerStart.clear();
      startInput.value = '';
    }
  }

  #setDatepickerEnd() {
    const endInput = this.element.querySelector('#event-end-time-1');
    if (!endInput){
      return;
    }
    const defaultDate = this._state.dateTo ? new Date(this._state.dateTo) : undefined;
    this.#datepickerEnd = flatpickr(endInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      defaultDate: defaultDate,
      onChange: this.#dateToChangeHandler,
      minDate: this._state.dateFrom ? new Date(this._state.dateFrom) : null,
    });
    if (!this._state.dateTo) {
      this.#datepickerEnd.clear();
      endInput.value = '';
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const { dateFrom, dateTo, destination, basePrice } = this._state;

    if (!dateFrom || !dateTo) {
      this.shake();
      return;
    }
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate) {
      this.shake();
      return;
    }

    if (!basePrice || Number(basePrice) <= 0) {
      this.shake();
      return;
    }

    const destinationExists = this.#allDestinations.some((item) => item.id === destination);
    if (!destinationExists) {
      this.shake();
      return;
    }

    this.#handleFormSubmit(NewEditFormView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick?.(NewEditFormView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    if (userDate && !isNaN(userDate)) {
      this._setState({ dateFrom: userDate.toISOString() });
    } else {
      this._setState({ dateFrom: null });
      const input = this.element.querySelector('#event-start-time-1');
      if (input){
        input.value = '';
      }
    }
    this.#updateDatepickersConstraints();
  };

  #dateToChangeHandler = ([userDate]) => {
    if (userDate && !isNaN(userDate)) {
      this._setState({ dateTo: userDate.toISOString() });
    } else {
      this._setState({ dateTo: null });
      const input = this.element.querySelector('#event-end-time-1');
      if (input){
        input.value = '';
      }
    }
    this.#updateDatepickersConstraints();
  };

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
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const targetName = evt.target.value;
    const matchedDestination = this.#allDestinations.find((item) => item.name === targetName);
    if (matchedDestination) {
      this.updateElement({ destination: matchedDestination.id });
    } else {
      this.updateElement({ destination: '' });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({ basePrice: evt.target.value });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')){
      return;
    }
    const offerId = evt.target.dataset.offerId;
    let updatedOffers = [...this._state.offers];
    if (evt.target.checked) {
      if (!updatedOffers.includes(offerId)){
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
      offers: point.offers || [],
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      isNew: point.isNew || false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.typeOffers;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    delete point.isNew;
    return point;
  }
}
