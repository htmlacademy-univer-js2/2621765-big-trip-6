import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FILTERS } from './const';
dayjs.extend(duration);

const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YY HH:mm',
  TIME_ONLY: 'HH:mm',
  DATE_ONLY: 'DD/MM/YY'
};

const humanizePointDueDate = (dueDate) => (
  !dueDate ? '' : dayjs(dueDate).format(DATE_FORMATS.DISPLAY)
);

const humanizeTime = (dueDate) => (
  !dueDate ? '' : dayjs(dueDate).format(DATE_FORMATS.TIME_ONLY)
);

const humanizeDateOnly = (dueDate) => {
  if (!dueDate) {
    return '';
  }
  return dayjs(dueDate).format(DATE_FORMATS.DATE_ONLY);
};
const calculateDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '0H 0M';
  }

  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  if (!start.isValid() || !end.isValid()) {
    return '0H 0M';
  }

  const diffInMinutes = end.diff(start, 'minute');

  if (diffInMinutes < 0) {
    return '0H 0M';
  }

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;


  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}H ${formattedMinutes}M`;
};

const getRandomInteger = (min, max) => (
  Math.floor(Math.random() * (max - min + 1)) + min
);

const getRandomArrayElement = (items) => (
  items[Math.floor(Math.random() * items.length)]
);


const filter = {
  everything: (points) => points,
  future: (points) => points.filter((point) => new Date(point.dateFrom) > new Date()),
  present: (points) => points.filter((point) => {
    const now = new Date();
    const dateFrom = new Date(point.dateFrom);
    const dateTo = new Date(point.dateTo);
    return dateFrom <= now && dateTo >= now;
  }),
  past: (points) => points.filter((point) => new Date(point.dateTo) < new Date()),
};

export function getFiltersState(points, currentFilter = 'everything') {
  return FILTERS.map((filterDef) => ({
    ...filterDef,
    isChecked: filterDef.name === currentFilter,
    isDisabled: filter[filterDef.name](points).length === 0,
  }));
}
export {
  humanizePointDueDate,
  humanizeTime,
  humanizeDateOnly,
  calculateDuration,
  getRandomInteger,
  getRandomArrayElement,
  filter
};
