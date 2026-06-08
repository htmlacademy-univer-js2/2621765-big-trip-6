import FilterView from '../view/filter-view.js';
import { FilterType, FilterName, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { render, replace } from '../framework/render.js';

dayjs.extend(utc);

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

    const now = dayjs.utc().valueOf();

    const counts = {
      [FilterType.EVERYTHING]: points.length,
      [FilterType.FUTURE]: points.filter((p) => dayjs.utc(p.dateFrom).valueOf() > now).length,
      [FilterType.PRESENT]: points.filter((p) => {
        const from = dayjs.utc(p.dateFrom).valueOf();
        const to = dayjs.utc(p.dateTo).valueOf();
        return from <= now && to >= now;
      }).length,
      [FilterType.PAST]: points.filter((p) => dayjs.utc(p.dateTo).valueOf() < now).length,
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
