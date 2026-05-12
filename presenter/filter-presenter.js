import { render, replace } from '../src/framework/render.js';
import FilterView from '../src/view/filter-view.js';
import { FilterType, FilterName, UpdateType } from '../src/const.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ container, filterModel, pointsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#handlePointsChange.bind(this));
    this.#filterModel.addObserver(this.#handleFilterChange.bind(this));
    this.#renderFilter();
  }

  #handlePointsChange() {
    this.#renderFilter();
  }

  #handleFilterChange() {
    this.#renderFilter();
  }

  #getFilters() {
    const points = this.#pointsModel.getPoints();
    const currentFilter = this.#filterModel.getFilter();

    const counts = {
      [FilterType.EVERYTHING]: points.length,
      [FilterType.FUTURE]: points.filter((p) => new Date(p.dateFrom) > new Date()).length,
      [FilterType.PRESENT]: points.filter((p) => {
        const now = new Date();
        return new Date(p.dateFrom) <= now && new Date(p.dateTo) >= now;
      }).length,
      [FilterType.PAST]: points.filter((p) => new Date(p.dateTo) < new Date()).length,
    };

    return Object.values(FilterType).map((type) => ({
      type: FilterName[type],
      value: type,
      isChecked: currentFilter === type,
      isDisabled: counts[type] === 0,
    }));
  }

  #renderFilter() {
    const filters = this.#getFilters();
    const prevComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters);
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterTypeChange);

    if (!prevComponent) {
      render(this.#filterComponent, this.#container);
    } else {
      replace(this.#filterComponent, prevComponent);
    }
  }

  #handleFilterTypeChange = (filterLabel) => {
    const newFilter = Object.entries(FilterName).find((entry) => entry[1] === filterLabel)?.[0];
    if (!newFilter || this.#filterModel.getFilter() === newFilter){
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, newFilter);
  };
}
