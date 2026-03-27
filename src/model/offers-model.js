import { mockOffers } from '../mock/offers';

export default class OffersModel {
  #offers = mockOffers;

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((item) => item.type === type);
  }

  getOffersById(type, itemsId){
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }
}
