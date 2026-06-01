import Observable from '../framework/observable.js';
import { FilterType, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const EMPTY_MESSAGES = {
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
};

export default class FilterModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  getFilter() {
    return this.#currentFilter;
  }

  setFilter(updateType, filter) {
    const isMajor = updateType === UpdateType.MAJOR;
    if (this.#currentFilter === filter && !isMajor) {
      return;
    }
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }

  getFilteredPoints(points) {
    const now = dayjs.utc().valueOf();
    switch (this.#currentFilter) {
      case FilterType.FUTURE:
        return points.filter((point) => dayjs.utc(point.dateFrom).valueOf() > now);
      case FilterType.PRESENT:
        return points.filter((point) => {
          const from = dayjs.utc(point.dateFrom).valueOf();
          const to = dayjs.utc(point.dateTo).valueOf();
          return from <= now && to >= now;
        });
      case FilterType.PAST:
        return points.filter((point) => dayjs.utc(point.dateTo).valueOf() < now);
      default:
        return [...points];
    }
  }

  getEmptyMessage() {
    return EMPTY_MESSAGES[this.#currentFilter];
  }
}
