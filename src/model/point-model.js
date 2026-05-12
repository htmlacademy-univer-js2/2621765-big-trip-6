import { getRandomPoint } from '../mock/points';
import Observable from '../framework/observable.js';

const POINT_COUNT = 4;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT_COUNT }, getRandomPoint);

  getPoints() {
    return this.#points;
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
}
