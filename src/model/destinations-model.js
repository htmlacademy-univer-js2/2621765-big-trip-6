import { getRandomDestination } from '../mock/point.js';

const DESTINATION_COUNT = 3;

export default class DestinationsModel {
  destinations = Array.from({ length: DESTINATION_COUNT }, getRandomDestination);

  getDestinations() {
    return this.destinations;
  }
}
