import FilterView from '../src/view/filter-view.js';
import { filter } from '../src/util.js';
import { render , replace } from '../src/framework/render.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterView = null;
  #currentFilterType = 'everything';
  #onFilterChange = null;
  constructor({ container, pointsModel, onFilterChange }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    this.#renderFilter();
  }

  #renderFilter() {
    const filters = this.#getFilters();
    const oldFilterView = this.#filterView;

    this.#filterView = new FilterView(filters);
    this.#filterView.setFilterChangeHandler(this.#handleFilterChange.bind(this));

    if (oldFilterView === null) {
      render(this.#filterView, this.#container);
    } else {
      replace(this.#filterView, oldFilterView);
    }
  }

  #getFilters() {
    const points = this.#pointsModel.getPoints();
    const filterTypes = ['everything', 'future', 'present', 'past'];

    return filterTypes.map((type) => {
      const filteredPoints = filter[type](points);
      const isDisabled = filteredPoints.length === 0;
      const isChecked = type === this.#currentFilterType;
      return { type, isChecked, isDisabled };
    });
  }

  #handleFilterChange(filterType) {
    if (filterType === this.#currentFilterType) {
      return;
    }
    this.#currentFilterType = filterType;
    this.#renderFilter();
    if (this.#onFilterChange) {
      this.#onFilterChange(this.#currentFilterType);
    }
  }


  getFilteredPoints() {
    const points = this.#pointsModel.getPoints();
    return filter[this.#currentFilterType](points);
  }

  setFilter(filterType) {
    if (!filter[filterType]) {
      return;
    }
    this.#handleFilterChange(filterType);
  }

  setOnFilterChange(callback) {
    this.#onFilterChange = callback;
  }
}
