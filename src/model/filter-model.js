import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  getFilter() {
    return this.#currentFilter;
  }

  setFilter(updateType, filter) {
    if (this.#currentFilter === filter){
      return;
    }
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }

  getFilteredPoints(points) {
    const now = new Date();
    switch (this.#currentFilter) {
      case FilterType.FUTURE:
        return points.filter((point) => new Date(point.dateFrom) > now);
      case FilterType.PRESENT:
        return points.filter((point) => {
          const from = new Date(point.dateFrom);
          const to = new Date(point.dateTo);
          return from <= now && to >= now;
        });
      case FilterType.PAST:
        return points.filter((point) => new Date(point.dateTo) < now);
      default:
        return [...points];
    }
  }

  getEmptyMessage() {
    switch (this.#currentFilter) {
      case FilterType.FUTURE:
        return 'There are no future events now';
      case FilterType.PRESENT:
        return 'There are no present events now';
      case FilterType.PAST:
        return 'There are no past events now';
      default:
        return 'Click New Event to create your first point';
    }
  }
}
