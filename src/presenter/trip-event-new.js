import EventEdit from "../view/event-edit.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {UserAction, UpdateType, EscKeyEvent} from "../const.js";

export default class TripEventNew {
  constructor(eventsListContainer, changeData, offersModel, destinationsModel) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EventEdit(event, this._offersModel, this._destinationsModel, true);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventsListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === EscKeyEvent.ESCAPE || evt.key === EscKeyEvent.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
