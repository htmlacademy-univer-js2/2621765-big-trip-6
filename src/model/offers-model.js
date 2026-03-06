import { getRandomOffer } from '../mock/point.js';

const OFFER_COUNT = 3;

export default class OffersModel {
  offers = Array.from({ length: OFFER_COUNT }, getRandomOffer);

  getOffers() {
    return this.offers;
  }
}
