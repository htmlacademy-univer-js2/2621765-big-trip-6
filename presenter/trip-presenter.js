import NewCreateFormView from '../src/view/create-form-view.js';
import NewEditFormView from '../src/view/edit-form-view.js';
import PointView from '../src/view/point-view.js';
import SortView from '../src/view/sort-view.js';
import {render} from '../src/render.js';


export default class TripPresenter {
  constructor({tripEventsContainer,pointsModel,destinationsModel, offersModel}) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.tripPoints = [... this.destinationsModel.getDestinations()];
    this.tripPoints = [...this.offersModel.getOffers()];
    render(new SortView(), this.tripEventsContainer);

    render(new NewCreateFormView(), this.tripEventsContainer);

    render(new NewEditFormView({point: this.tripPoints[0]}), this.tripEventsContainer);

    for (let i = 1; i < this.tripPoints.length; i++) {
      render(new PointView({point: this.tripPoints[i]}), this.tripEventsContainer);
    }
  }
}
