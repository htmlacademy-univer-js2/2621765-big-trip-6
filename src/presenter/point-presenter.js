import { render, replace, remove } from '../framework/render.js';
import NewEditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import { Mode, UserAction, UpdateType } from '../const.js';

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
  #mode = Mode.DEFAULT;
  #isNew = false;
  #onCancelCreate = null;

  constructor({ pointListContainer, destinationsModel, offersModel, onPointChange, onModeChange, isNew = false, onCancelCreate }) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onPointChange;
    this.#handleModeChange = onModeChange;
    this.#isNew = isNew;
    this.#onCancelCreate = onCancelCreate;
  }

  init(point, destination, offers) {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    const prevPointComponent = this.#pointView;
    const prevEditComponent = this.#editForm;

    this.#pointView = new PointView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onOpenEditButtonClick: this.#openEditButtonClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    if (this.#isNew) {
      this.#openEditFormDirectly();
      return;
    }

    if (!prevPointComponent || !prevEditComponent) {
      render(this.#pointView, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointComponent);
    } else if (this.#mode === Mode.EDITING) {
      replace(this.#pointView, prevEditComponent);
      this.#mode = Mode.DEFAULT;
    }
  }

  destroy() {
    remove(this.#pointView);
    if (this.#editForm) {
      remove(this.#editForm);
    }
    this.#pointView = null;
    this.#editForm = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT && this.#editForm) {
      this.#editForm.reset(this.#point);
      this.#closeForm();
    }
  }

  openEditForm() {
    if (this.#mode === Mode.DEFAULT) {
      this.#replacePointToEditPoint();
    }
  }

  setAborting() {
    if (!this.#editForm) {
      return;
    }
    const resetFormState = () => {
      if (this.#editForm) {
        this.#editForm.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };
    this.#editForm.shake(resetFormState);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING && this.#editForm) {
      this.#editForm.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING && this.#editForm) {
      this.#editForm.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #createEditForm() {
    return new NewEditFormView({
      point: { ...this.#point, isNew: this.#isNew },
      typeOffers: this.#offersModel.getOffersByType(this.#point.type),
      allOffers: this.#offersModel.getOffers(),
      allDestinations: this.#destinationsModel.getDestinations(),
      onFormSubmit: this.#submitButtonClickHandler,
      onEditRollup: this.#closeEditButtonClickHandler,
      onDeleteClick: this.#deleteButtonClickHandler,
    });
  }

  #openEditFormDirectly() {
    this.#editForm = this.#createEditForm();
    render(this.#editForm, this.#pointListContainer, 'afterbegin');
    this.#mode = Mode.EDITING;
    this.#handleModeChange();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #closeForm() {
    if (this.#mode !== Mode.DEFAULT) {
      if (this.#isNew) {
        document.removeEventListener('keydown', this.#escKeyDownHandler);
        if (this.#onCancelCreate) {
          this.#onCancelCreate(this.#point);
        }
        this.destroy();
        return;
      }

      if (this.#editForm) {
        remove(this.#editForm);
        this.#editForm = null;
      }

      if (this.#pointView && !this.#pointView.isRendered()) {
        render(this.#pointView, this.#pointListContainer);
      }

      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = Mode.DEFAULT;
    }
  }

  #replacePointToEditPoint() {
    this.#editForm = this.#createEditForm();
    replace(this.#editForm, this.#pointView);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeForm();
    }
  };

  #openEditButtonClickHandler = () => {
    this.#replacePointToEditPoint();
  };

  #closeEditButtonClickHandler = () => {
    this.#closeForm();
  };

  #submitButtonClickHandler = (updatedPoint) => {
    const action = this.#isNew ? UserAction.ADD_POINT : UserAction.UPDATE_POINT;
    const updateType = action === UserAction.UPDATE_POINT ? UpdateType.MINOR : UpdateType.MAJOR;
    this.#handleDataChange(action, updateType, updatedPoint);
  };

  #deleteButtonClickHandler = () => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MAJOR, this.#point);
    if (!this.#isNew) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, { ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}
