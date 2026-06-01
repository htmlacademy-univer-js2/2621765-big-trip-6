import ApiService from './framework/api-service.js';

const OFFERS_URL = 'offers';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({ url: OFFERS_URL })
      .then(ApiService.parseResponse);
  }
}
