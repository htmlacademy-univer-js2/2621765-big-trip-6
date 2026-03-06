import dayjs from 'dayjs';

const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YY HH:mm',
  TIME_ONLY: 'HH:mm',
  DATE_ONLY: 'DD/MM/YY'
};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMATS.DISPLAY) : '';
}

function humanizeTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMATS.TIME_ONLY) : '';
}

function humanizeDateOnly(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMATS.DATE_ONLY) : '';
}

export {getRandomArrayElement,humanizePointDueDate,humanizeTime,humanizeDateOnly};
