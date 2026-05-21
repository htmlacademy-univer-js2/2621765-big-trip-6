import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

  }

  getPoints() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#points = [];
      this._notify(UpdateType.INIT);
    }
  }

  setPoints(updateType, points) {
    this.#points = points;
    this._notify(updateType, points);
  }

  updatePoint(updateType, point) {
    const index = this.#points.findIndex((p) => p.id === point.id);
    if (index === -1){
      throw new Error('Can\'t update unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      point,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, point);
  }

  addPoint(updateType, point) {
    this.#points = [point, ...this.#points];
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    const index = this.#points.findIndex((p) => p.id === point.id);
    if (index === -1){
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
