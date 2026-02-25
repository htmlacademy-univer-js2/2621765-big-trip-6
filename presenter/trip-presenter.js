import NewCreateFormView from '../src/view/create-form-view.js';
import NewEditFormView from '../src/view/edit-form-view.js';
import PointView from '../src/view/point-view.js';
import SortView from '../src/view/sort-view.js';
import {render} from '../src/render.js';

const COUNT_POINT = 3;

export default class TripPresenter {
  constructor({tripEventsContainer}) {
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    render(new SortView(), this.tripEventsContainer);

    render(new NewCreateFormView(), this.tripEventsContainer);

    render(new NewEditFormView(), this.tripEventsContainer);

    for (let i = 0; i < COUNT_POINT; i++) {
      render(new PointView(), this.tripEventsContainer);
    }
  }
}
