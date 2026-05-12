import { mockOffers } from '../mock/offers';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = mockOffers;

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
