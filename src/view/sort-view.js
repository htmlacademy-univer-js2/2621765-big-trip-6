import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortTemplate(currentSortType) {
  const sorts = [
    { type: SortType.DAY, label: 'Day' },
    { type: SortType.TIME, label: 'Time' },
    { type: SortType.PRICE, label: 'Price' },
  ];

  const sortsHtml = sorts.map(({ type, label }) => {
    const checked = currentSortType === type ? 'checked' : '';
    return `
      <div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" ${checked}>
        <label class="trip-sort__btn" for="sort-${type}">${label}</label>
      </div>
    `;
  }).join('');

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${sortsHtml}</form>`;
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
