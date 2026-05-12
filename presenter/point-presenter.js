import { render, replace, remove } from '../src/framework/render.js';
import NewEditFormView from '../src/view/edit-form-view.js';
import PointView from '../src/view/point-view.js';
import { MODE, UserAction } from '../src/const.js';

export default class PointPresenter {
  #pointListContainer = null;
  #editForm = null;
  #pointView = null;
  #point = null;
  #destinationsModel = null;
  #offersModel = null;
  #destination = null;
  #offers = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = MODE.DEFAULT;
  #isNew = false;

  constructor({ pointListContainer, destinationsModel, offersModel, onPointChange, onModeChange, isNew = false }) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onPointChange;
    this.#handleModeChange = onModeChange;
    this.#isNew = isNew;
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
      allDestinations: this.#destinationsModel.getDestinations(),
      onFormSubmit: this.#onSubmitButtonClick,
      onEditRollup: this.#onCloseEditButtonClick,
      onDeleteClick: this.#onDeleteButtonClick,
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
      this.#editForm.reset(this.#point);
      this.#closeForm();
    }
  }

  openEditForm() {
    if (this.#mode === MODE.DEFAULT) {
      this.#replacePointToEditPoint();
    }
  }

  #closeForm() {
    if (this.#mode !== MODE.DEFAULT) {
      if (this.#editForm?.element){
        remove(this.#editForm);
      }
      if (this.#pointView?.element && !this.#pointView.element.parentElement) {
        render(this.#pointView, this.#pointListContainer);
      }
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = MODE.DEFAULT;
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editForm.reset(this.#point);
      this.#closeForm();
    }
  };

  #onOpenEditButtonClick = () => {
    this.#replacePointToEditPoint();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #onCloseEditButtonClick = () => {
    this.#closeForm();
  };

  #onSubmitButtonClick = (updatedPoint) => {
    const action = this.#isNew ? UserAction.ADD_POINT : UserAction.UPDATE_POINT;
    const updateType = (action === UserAction.UPDATE_POINT) ? 'minor' : 'major';
    this.#handleDataChange(action, updateType, updatedPoint);
    if (!this.#isNew) {
      this.#closeForm();
    }
  };

  #onDeleteButtonClick = () => {
    this.#handleDataChange(UserAction.DELETE_POINT, 'major', this.#point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #replacePointToEditPoint() {
    replace(this.#editForm, this.#pointView);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #favoriteClickHandler = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, 'minor', { ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}

