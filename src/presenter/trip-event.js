import Event from "../view/event.js";
import EventEdit from "../view/event-edit.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType, EscKeyEvent} from "../const.js";
import {toast} from "../utils/toast/toast.js";
import {isOnline} from "../utils/common.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class TripEvent {
  constructor(eventsListContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new Event(event);
    this._eventEditComponent = new EventEdit(event, this._offersModel, this._destinationsModel);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setRollupClickHandler(this._handleRollupClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    this._eventEditComponent.reset(this._event);
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(`You can't edit event offline`);
      return;
    }

    this._replacePointToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleRollupClick() {
    this._replaceFormToPoint();
  }

  _handleFormSubmit(event) {
    if (!isOnline()) {
      toast(`You can't save event offline`);
      return;
    }

    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleDeleteClick(event) {
    if (!isOnline()) {
      toast(`You can't delete event offline`);
      return;
    }

    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === EscKeyEvent.ESCAPE || evt.key === EscKeyEvent.ESC) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }
}
