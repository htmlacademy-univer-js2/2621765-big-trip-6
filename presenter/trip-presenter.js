import NewCreateFormView from '../src/view/create-form-view.js';
import NewEditFormView from '../src/view/edit-form-view.js';
import PointView from '../src/view/point-view.js';
import SortView from '../src/view/sort-view.js';
import { render } from '../src/render.js';

export default class TripPresenter {
  constructor({ tripEventsContainer, pointsModel, destinationsModel, offersModel }) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    const points = [...this.pointsModel.getPoints()];
    const destinations = [...this.destinationsModel.getDestinations()];

    this.tripEventsContainer.innerHTML = '';

    render(new SortView(), this.tripEventsContainer);

    render(new NewCreateFormView({ point: {} }), this.tripEventsContainer);

    points.forEach((point, index) => {
      if (!point) {
        return;
      }

      const destination = this.destinationsModel.getDestinationsById(point.destination);
      const pointOffers = this.offersModel.getOffersById(point.type, point.offers || []);

      if (index === 0) {
        const offersByType = this.offersModel.getOffersByType(point.type);
        const editForm = new NewEditFormView({
          point: point,
          allOffers: offersByType || { offers: [] },
          pointDestination: destination || {},
          allDestinations: destinations
        });
        render(editForm, this.tripEventsContainer);
      } else {
        const pointView = new PointView({
          point: point,
          offers: pointOffers,
          destination: destination
        });
        render(pointView, this.tripEventsContainer);
      }
    });
  }
}
