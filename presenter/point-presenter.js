import { render, replace, remove } from '../src/framework/render.js';
import NewEditFormView from '../src/view/edit-form-view.js';
import PointView from '../src/view/point-view.js';
import { MODE } from '../src/const.js';

export default class PointPresenter {
  #pointListContainer = null;
  #editForm = null;
  #pointView = null;
  #point = null;
  #destinationsModel = null;
  #offersModel = null;
  #destination = null;
  #offers = null;
  #destinations = [];
  #offersByType = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = MODE.DEFAULT;

  constructor({ pointListContainer, destinationsModel, offersModel, onPointChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#destinations = [...this.#destinationsModel.getDestinations()];
    this.#handleDataChange = onPointChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, destination, offers) {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    const currentTypeOffers = this.#offersModel.getOffersByType(this.#point.type);
    const allOffers = this.#offersModel.getOffers();

    const prevPointComponent = this.#pointView;
    const prevEditComponent = this.#editForm;

    this.#pointView = new PointView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onOpenEditButtonClick: this.#onOpenEditButtonClick,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#editForm = new NewEditFormView({
      point: this.#point,
      typeOffers: currentTypeOffers,
      allOffers: allOffers,
      pointDestination: this.#destination,
      allDestinations: this.#destinations,
      onCloseEditButtonClick: this.#onCloseEditButtonClick,
      onSubmitButtonClick: this.#onSubmitButtonClick,
      onFormSubmit: this.#onSubmitButtonClick,
      onEditRollup: this.#onCloseEditButtonClick,
    });

    if (!prevPointComponent || !prevEditComponent) {
      render(this.#pointView, this.#pointListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#pointView, prevPointComponent);
    } else if (this.#mode === MODE.EDITING) {
      replace(this.#editForm, prevEditComponent);
    }
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#editForm);
    this.#pointView = null;
    this.#editForm = null;
  }

  resetView() {
    if (this.#mode !== MODE.DEFAULT) {
      this.#replaceEditPointToPaint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditPointToPaint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #onOpenEditButtonClick = () => {
    this.#replacePointToEditPoint();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #onCloseEditButtonClick = () => {
    this.#replaceEditPointToPaint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #onSubmitButtonClick = () => {
    this.#replaceEditPointToPaint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #replacePointToEditPoint() {
    replace(this.#editForm, this.#pointView);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceEditPointToPaint() {
    replace(this.#pointView, this.#editForm);
    this.#mode = MODE.DEFAULT;
  }

  #favoriteClickHandler = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}
