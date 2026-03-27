import { humanizePointDueDate } from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';

function createNewFormTemplate(point = {}) {
  const {
    type = 'flight',
    name = '',
    dateFrom = new Date().toISOString(),
    dateTo = new Date().toISOString(),
    basePrice = 0
  } = point;

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
    return icons[iconType] || 'img/icons/point.png';
  };


  const safeDateStart = dateStart || '';
  const safeDateEnd = dateEnd || '';
  const safeType = type || 'flight';
  const safeName = name || '';
  const safeBasePrice = basePrice || 0;

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
              <div class="event__type-item">
                <input
                  id="event-type-${safeType}-1"
                  class="event__type-input visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${safeType}"
                  checked
                >
                <label
                  class="event__type-label event__type-label--${safeType}"
                  for="event-type-${safeType}-1"
                >
                  ${safeType}
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${safeType}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${safeName}"
            list="destination-list-1"
            placeholder="Select destination"
          >
          <datalist id="destination-list-1">
            <option value="Amsterdam">Amsterdam</option>
            <option value="Geneva">Geneva</option>
            <option value="Chamonix">Chamonix</option>
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${safeDateStart}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${safeDateEnd}"
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
            value="${safeBasePrice}"
            min="0"
          >
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      <section class="event__details">
        <section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            <p class="event__offer-empty">No additional offers</p>
          </div>
        </section>

        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${safeName ? `Description of ${safeName}` : ''}</p>
        </section>
      </section>
    </form>
  `;
}

export default class NewCreateFormView extends AbstractView{
  #point = null;
  constructor({ point } = {}) {
    super();
    this.#point = point || {};
  }

  get template() {
    return createNewFormTemplate(this.#point);
  }

}
