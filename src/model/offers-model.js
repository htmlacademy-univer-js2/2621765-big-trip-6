import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
export default class OffersModel extends Observable {
  #offers = [];
  #offersApiService = null;

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#offers = [];
      throw err;
    }
  }

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    if (!offersType){
      return [];
    }
    return offersType.offers.filter((item) => itemsId.includes(item.id));
  }

}
