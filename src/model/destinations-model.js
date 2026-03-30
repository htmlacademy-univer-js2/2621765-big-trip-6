import { mockDestinations } from '../mock/destinations';


export default class DestinationsModel {
  #destinations = mockDestinations;

  getDestinations() {
    return this.#destinations;
  }

  getDestinationsById(id){
    const allDestinations = this.getDestinations();
    return allDestinations.find((item) => item.id === id);
  }
}
