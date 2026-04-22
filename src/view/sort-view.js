import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortTemplate(currentSortType) {
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day" data-sort-type="${SortType.DAY}">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event" data-sort-type="${SortType.EVENT}">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time" data-sort-type="${SortType.TIME}">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price" data-sort-type="${SortType.PRICE}">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer" data-sort-type="${SortType.OFFER}">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>
  `;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ onSortTypeChange, currentSortType }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const sortItem = evt.target.closest('[data-sort-type]');
    if (!sortItem){
      return;
    }
    const sortType = sortItem.dataset.sortType;
    if (sortType === this.#currentSortType){
      return;
    }
    this.#handleSortTypeChange(sortType);
  };

  updateSortType(sortType) {
    this.#currentSortType = sortType;
    const inputs = this.element.querySelectorAll('.trip-sort__input');
    inputs.forEach((input) => {
      const parentDiv = input.closest('[data-sort-type]');
      if (parentDiv) {
        const type = parentDiv.dataset.sortType;
        input.checked = (type === sortType);
      }
    });
  }

  removeElement() {
    if (this.element) {
      this.element.removeEventListener('click', this.#sortTypeChangeHandler);
    }
    super.removeElement();
  }
}
