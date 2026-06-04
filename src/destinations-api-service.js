import ApiService from './framework/api-service.js';

const DESTINATIONS_URL = 'destinations';

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({ url: DESTINATIONS_URL }).then(ApiService.parseResponse);
  }
}
