import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  getPoints() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map((point) => this.#adaptToClient(point));
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#points = [];
      throw err;
    }
  }

  setPoints(updateType, points) {
    this.#points = points;
    this._notify(updateType, points);
  }

  async updatePoint(updateType, point) {
    const updatedPoint = await this.#pointsApiService.updatePoint(point);
    const adaptedUpdatedPoint = this.#adaptToClient(updatedPoint);
    const index = this.#points.findIndex((p) => p.id === adaptedUpdatedPoint.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      adaptedUpdatedPoint,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, adaptedUpdatedPoint);
  }

  async addPoint(updateType, point) {
    try {
      const response = await this.#pointsApiService.addPoint(point);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, point) {
    const index = this.#points.findIndex((p) => p.id === point.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    try {
      await this.#pointsApiService.deletePoint(point);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
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
