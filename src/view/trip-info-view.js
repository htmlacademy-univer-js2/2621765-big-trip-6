import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';

const DATE_LOCALE = 'en-US';
const DATE_MONTH_OPTION = 'short';
const DATE_OPTIONS = { month: DATE_MONTH_OPTION };

const ROUTE_SEPARATOR = ' — ';
const ROUTE_ELLIPSIS = ' — ... — ';

const TOTAL_PRICE_PREFIX = 'Total: &euro;&nbsp;';

function buildRoute(points, destinations) {
  if (!points.length) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cities = sortedPoints
    .map((point) => {
      const destination = destinations.find((item) => item.id === point.destination);
      return destination ? destination.name : '';
    })
    .filter(Boolean);

  const citiesCount = cities.length;
  if (citiesCount === 0) {
    return '';
  }
  if (citiesCount === 1) {
    return cities[0];
  }
  if (citiesCount === 2) {
    return `${cities[0]}${ROUTE_SEPARATOR}${cities[1]}`;
  }
  if (citiesCount === 3) {
    return `${cities[0]}${ROUTE_SEPARATOR}${cities[1]}${ROUTE_SEPARATOR}${cities[2]}`;
  }
  return `${cities[0]}${ROUTE_ELLIPSIS}${cities[citiesCount - 1]}`;
}

function buildDates(points) {
  if (!points.length) {
    return '';
  }

  const fromDates = points.map((point) => new Date(point.dateFrom));
  const toDates = points.map((point) => new Date(point.dateTo));
  const start = new Date(Math.min(...fromDates));
  const end = new Date(Math.max(...toDates));

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleDateString(DATE_LOCALE, DATE_OPTIONS).toUpperCase();
  const endMonth = end.toLocaleDateString(DATE_LOCALE, DATE_OPTIONS).toUpperCase();

  if (startMonth === endMonth) {
    return `${startDay}${ROUTE_SEPARATOR}${endDay} ${startMonth}`;
  }
  return `${startDay} ${startMonth}${ROUTE_SEPARATOR}${endDay} ${endMonth}`;
}

function calculateTotalPrice(points, offersModel) {
  return points.reduce((total, point) => {
    const basePrice = Number(point.basePrice) || 0;
    let offersTotal = 0;

    const offersForType = offersModel.getOffersByType(point.type);
    if (offersForType && Array.isArray(point.offers)) {
      point.offers.forEach((offerId) => {
        const offer = offersForType.offers.find((offerItem) => offerItem.id === offerId);
        if (offer) {
          offersTotal += Number(offer.price) || 0;
        }
      });
    }
    return total + basePrice + offersTotal;
  }, 0);
}

function createTripInfoTemplate(points, destinations, offersModel) {
  const route = buildRoute(points, destinations);
  const dates = buildDates(points);
  const price = calculateTotalPrice(points, offersModel);

  const safeRoute = he.encode(route);
  const safeDates = he.encode(dates);
  const safePrice = he.encode(String(price));

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${safeRoute}</h1>
        <p class="trip-info__dates">${safeDates}</p>
      </div>
      <p class="trip-info__cost">
        ${TOTAL_PRICE_PREFIX}<span class="trip-info__cost-value">${safePrice}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #points = [];
  #destinations = [];
  #offersModel = null;

  constructor({ points, destinations, offersModel }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offersModel = offersModel;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offersModel);
  }
}
