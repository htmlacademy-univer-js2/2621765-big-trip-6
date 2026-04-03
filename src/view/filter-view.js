import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate({ type, isChecked = false, isDisabled = false }) {
  const checkedAttr = isChecked ? 'checked' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}"
             class="trip-filters__filter-input visually-hidden"
             type="radio"
             name="trip-filter"
             value="${type}"
             ${checkedAttr}
             ${disabledAttr}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `;
}

function createFilterTemplate(filters) {
  if (!filters || filters.length === 0) {
    return '';
  }
  return `
    <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filters.map((filter) => createFilterItemTemplate(filter)).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>
  `;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterChange = null;

  constructor(filters) {
    super();
    this.#filters = filters || [];
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  setFilterChangeHandler(callback) {
    this.#handleFilterChange = callback;
    this.element.querySelectorAll('.trip-filters__filter-input').forEach((input) => {
      input.addEventListener('change', (evt) => {
        if (evt.target.checked) {
          this.#handleFilterChange?.(evt.target.value);
        }
      });
    });
  }
}
