import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FilterType } from './const';
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


const updateItem = (items,update) => items.map((item) => item.id === update.id ? update : item);

const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);
const isPointPresent = (point) => dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
const isPointPast = (point) => dayjs().isAfter(point.dateTo);

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortTaskUp(taskA, taskB) {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
}

function sortTaskDown(taskA, taskB) {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
}

export {
  humanizePointDueDate,
  humanizeTime,
  humanizeDateOnly,
  calculateDuration,
  getRandomInteger,
  getRandomArrayElement,
  filter,
  updateItem,
  sortTaskUp,
  sortTaskDown
};
