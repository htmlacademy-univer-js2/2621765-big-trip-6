import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
export default class DestinationsModel extends Observable {
  #destinations = [];
  #destinationsApiService = null;

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;

  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#destinations = [];
      throw err;
    }
  }

  getDestinations() {
    return this.#destinations;
  }

  getDestinationsById(id) {
    return this.#destinations.find((item) => item.id === id);
  }
}
