import AbstractView from '../framework/view/abstract-view.js';


function buildRoute(points, destinations) {
  if (!points.length){
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cities = sortedPoints
    .map((point) => {
      const destination = destinations.find((dest) => dest.id === point.destination);
      return destination ? destination.name : '';
    })
    .filter(Boolean);

  if (cities.length === 0){
    return '';
  }
  if (cities.length === 1){
    return cities[0];
  }
  if (cities.length === 2){
    return `${cities[0]} — ${cities[1]}`;
  }
  return `${cities[0]} — ... — ${cities[cities.length - 1]}`;
}


function buildDates(points) {
  if (!points.length){
    return '';
  }

  const fromDates = points.map((p) => new Date(p.dateFrom));
  const toDates = points.map((p) => new Date(p.dateTo));
  const start = new Date(Math.min(...fromDates));
  const end = new Date(Math.max(...toDates));

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  if (startMonth === endMonth) {
    return `${startDay} — ${endDay} ${startMonth}`;
  }
  return `${startDay} ${startMonth} — ${endDay} ${endMonth}`;
}

function calculateTotalPrice(points, offersModel) {
  return points.reduce((total, point) => {
    // Преобразуем basePrice в число (если строка или null/undefined)
    const basePrice = Number(point.basePrice) || 0;
    let offersTotal = 0;

    const offersForType = offersModel.getOffersByType(point.type);
    if (offersForType && Array.isArray(point.offers)) {
      point.offers.forEach((offerId) => {
        const offer = offersForType.offers.find((o) => o.id === offerId);
        if (offer) {
          offersTotal += Number(offer.price) || 0;
        }
      });
    }

    const pointTotal = basePrice + offersTotal;
    return total + pointTotal;
  }, 0);
}


function createTripInfoTemplate(points, destinations, offersModel) {
  const route = buildRoute(points, destinations);
  const dates = buildDates(points);
  const price = calculateTotalPrice(points, offersModel);

  return `
    <div class="trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </div>
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
