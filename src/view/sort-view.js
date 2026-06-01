import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortTemplate(currentSortType) {
  const dayHtml = `
    <div class="trip-sort__item trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="day" ${currentSortType === SortType.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>
  `;

  const eventHtml = `
    <div class="trip-sort__item trip-sort__item--event">
      <span class="trip-sort__btn">Event</span>
    </div>
  `;

  const timeHtml = `
    <div class="trip-sort__item trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="time" ${currentSortType === SortType.TIME ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>
  `;

  const priceHtml = `
    <div class="trip-sort__item trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="price" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>
  `;

  const offersHtml = `
    <div class="trip-sort__item trip-sort__item--offers">
      <span class="trip-sort__btn">Offers</span>
    </div>
  `;

  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${dayHtml}
      ${eventHtml}
      ${timeHtml}
      ${priceHtml}
      ${offersHtml}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange, currentSortType }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#changeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #changeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT'){
      return;
    }
    this.#handleSortTypeChange(evt.target.value);
  };

  updateSortType(sortType) {
    this.#currentSortType = sortType;
    const inputs = this.element.querySelectorAll('.trip-sort__input');
    inputs.forEach((input) => {
      input.checked = input.value === sortType;
    });
  }
}
