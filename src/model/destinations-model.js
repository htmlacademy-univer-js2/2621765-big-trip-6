import { mockDestinations } from '../mock/destinations';
import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = mockDestinations;

  getDestinations() {
    return this.#destinations;
  }

  getDestinationsById(id) {
    return this.#destinations.find((item) => item.id === id);
  }
}
