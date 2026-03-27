//import NewCreateFormView from '../src/view/create-form-view.js';
import NewEditFormView from '../src/view/edit-form-view.js';
import PointView from '../src/view/point-view.js';
import SortView from '../src/view/sort-view.js';
import { render,replace } from '../src/framework/render.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  constructor({ tripEventsContainer, pointsModel, destinationsModel, offersModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    const points = [...this.#pointsModel.getPoints()];

    this.#tripEventsContainer.innerHTML = '';


    points.forEach((point, /*index*/) => {
      if (!point) {
        return;
      }

      const destination = this.#destinationsModel.getDestinationsById(point.destination);
      const pointOffers = this.#offersModel.getOffersById(point.type, point.offers || []);

      this.#renderPoint(point, destination, pointOffers);
    });
  }

  #renderPoint(point, destination, offers) {
    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replaceEditPointToPaint();
        document.removeEventListener('keydown',escKeyDownHandler);
      }
    };
    const onOpenEditButtonClick = () => {
      replacePointToEditPoint();
      document.addEventListener('keydown',escKeyDownHandler);
    };
    const onCloseEditButtonClick = () => {
      replaceEditPointToPaint();
      document.removeEventListener('keydown',escKeyDownHandler);
    };
    const onSubmitButtonClick = () => {
      replaceEditPointToPaint();
      document.removeEventListener('keydown',escKeyDownHandler);
    };

    const pointView = new PointView({
      point: point,
      offers: offers,
      destination: destination,
      onOpenEditButtonClick
    });
    const destinations = [...this.#destinationsModel.getDestinations()];
    const offersByType = this.#offersModel.getOffersByType(point.type);
    const editForm = new NewEditFormView({
      point: point,
      allOffers: offersByType || { offers: [] },
      pointDestination: destination || {},
      allDestinations: destinations,
      onCloseEditButtonClick,
      onSubmitButtonClick
    });
    function replacePointToEditPoint(){
      replace(editForm,pointView);
    }

    function replaceEditPointToPaint(){
      replace(pointView,editForm);
    }
    render(pointView, this.#tripEventsContainer);
  }

  #renderBoard() {
    render(new SortView(), this.#tripEventsContainer);
  }
}
