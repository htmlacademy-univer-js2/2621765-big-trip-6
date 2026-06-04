import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { FilterType } from './const.js';
import he from 'he';
import { EVENT_TYPES } from './const.js';

dayjs.extend(duration);
dayjs.extend(utc);

const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YY HH:mm',
  TIME_ONLY: 'HH:mm',
  DATE_ONLY: 'DD/MM/YY'
};

const DEFAULT_DURATION = '0M';

export function generateDestinationsOptions(destinations, selectedId) {
  return destinations.map((destination) => `
    <option value="${he.encode(destination.id)}" ${destination.id === selectedId ? 'selected' : ''}>
      ${he.encode(destination.name)}
    </option>
  `).join('');
}

export function generateOffersHTML(offersList, selectedOfferIds, isDisabled) {
  if (!offersList?.length){
    return '';
  }
  return offersList.map((offer) => {
    const isChecked = selectedOfferIds.includes(offer.id);
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden"
               id="event-offer-${offer.id}-1"
               type="checkbox"
               name="event-offer-${offer.id}"
               data-offer-id="${offer.id}"
               ${isChecked ? 'checked' : ''}
               ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}-1">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${he.encode(String(offer.price))}</span>
        </label>
      </div>
    `;
  }).join('');
}

export function generateEventTypesHTML(currentType, isDisabled) {
  return EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1"
             class="event__type-input visually-hidden"
             type="radio"
             name="event-type"
             value="${eventType}"
             ${eventType === currentType ? 'checked' : ''}
             ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label event__type-label--${eventType}"
             for="event-type-${eventType}-1">
        ${eventType}
      </label>
    </div>
  `).join('');
}

const humanizePointDueDate = (dueDate) => (
  !dueDate ? '' : dayjs.utc(dueDate).format(DATE_FORMATS.DISPLAY)
);

const humanizeTime = (dueDate) => (
  !dueDate ? '' : dayjs.utc(dueDate).format(DATE_FORMATS.TIME_ONLY)
);

const humanizeDateOnly = (dueDate) => {
  if (!dueDate){
    return '';
  }
  return dayjs.utc(dueDate).format(DATE_FORMATS.DATE_ONLY);
};

const calculateDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo){
    return DEFAULT_DURATION;
  }

  const start = dayjs.utc(dateFrom);
  const end = dayjs.utc(dateTo);

  if (!start.isValid() || !end.isValid()){
    return DEFAULT_DURATION;
  }

  const diffInMinutes = end.diff(start, 'minute');
  if (diffInMinutes < 0){
    return DEFAULT_DURATION;
  }

  const minutesInHour = 60;
  const minutesInDay = 1440;

  if (diffInMinutes < minutesInHour) {
    return `${diffInMinutes}M`;
  }

  const days = Math.floor(diffInMinutes / minutesInDay);
  const remainingAfterDays = diffInMinutes % minutesInDay;
  const hours = Math.floor(remainingAfterDays / minutesInHour);
  const minutes = remainingAfterDays % minutesInHour;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  if (days === 0) {
    return `${formattedHours}H ${formattedMinutes}M`;
  }

  return `${days}D ${formattedHours}H ${formattedMinutes}M`;
};

const isPointFuture = (point) => dayjs.utc().isBefore(dayjs.utc(point.dateFrom));
const isPointPresent = (point) => dayjs.utc().isAfter(dayjs.utc(point.dateFrom)) && dayjs.utc().isBefore(dayjs.utc(point.dateTo));
const isPointPast = (point) => dayjs.utc().isAfter(dayjs.utc(point.dateTo));

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};

export {
  humanizePointDueDate,
  humanizeTime,
  humanizeDateOnly,
  calculateDuration,
  filter
};
