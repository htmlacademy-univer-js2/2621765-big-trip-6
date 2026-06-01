import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const POINTS_URL = 'points';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: POINTS_URL }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${POINTS_URL}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return await ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const pointWithoutId = { ...point };
    delete pointWithoutId.id;
    const response = await this._load({
      url: POINTS_URL,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(pointWithoutId)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return await ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${POINTS_URL}/${point.id}`,
      method: Method.DELETE,
    });
    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': point.dateFrom ? new Date(point.dateFrom).toISOString() : null,
      'date_to': point.dateTo ? new Date(point.dateTo).toISOString() : null,
      'base_price': Number(point.basePrice),
      'is_favorite': point.isFavorite,
    };
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;
    return adaptedPoint;
  }
}
