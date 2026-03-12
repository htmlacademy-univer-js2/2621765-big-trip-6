//import { getRandomDestination } from '../mock/destinations';
import { mockDestinations } from '../mock/destinations';

//const DESTINATION_COUNT = 3;

export default class DestinationsModel {
  //destinations = Array.from({ length: DESTINATION_COUNT }, getRandomDestination);
  destinations = mockDestinations;

  getDestinations() {
    return this.destinations;
  }

  getDestinationsById(id){
    const allDestinations = this.getDestinations();
    return allDestinations.find((item) => item.id === id);
  }
}
