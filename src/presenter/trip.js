import TripSort from "../view/trip-sort.js";
import EventsList from "../view/events-list.js";
import NoEvents from "../view/no-events.js";
import TripEventPresenter, {State as TripEventPresenterViewState} from "./trip-event.js";
import TripEventNewPresenter from "./trip-event-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortTypes, UserAction, UpdateType} from "../const.js";
import {sortEventsByPrice, sortEventsByDuration, sortEventsByDate} from "../utils/event.js";
import {filter} from "../utils/filter.js";
import Loading from "../view/loading.js";

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, offersModel, destinationsModel, api) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SortTypes.DAY.name;
    this._isLoading = true;
    this._api = api;

    this._tripEventsContainer = tripContainer.querySelector(`.trip-events`);
    this._tripSortComponent = null;
    this._eventsComponent = new EventsList();
    this._noEventsComponent = new NoEvents();
    this._loadingComponent = new Loading();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new TripEventNewPresenter(this._eventsComponent, this._handleViewAction, offersModel, destinationsModel);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._eventsComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent() {
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortTypes.PRICE.name:
        return filteredEvents.sort(sortEventsByPrice);
      case SortTypes.TIME.name:
        return filteredEvents.sort(sortEventsByDuration);
    }

    return filteredEvents.sort(sortEventsByDate);
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setViewState(TripEventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(TripEventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(TripEventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(TripEventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType.name === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderTrip() {
    const tripEvents = this._getEvents().slice();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!tripEvents.length) {
      this._renderNoEvents();
    } else {
      remove(this._noEventsComponent);
      this._renderTripSort();
      this._renderEvents(tripEvents);
    }
  }

  _renderTripSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSort(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new TripEventPresenter(
        this._eventsComponent,
        this._handleViewAction,
        this._handleModeChange,
        this._offersModel,
        this._destinationsModel
    );

    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};

    if (this._tripSortComponent !== null) {
      remove(this._tripSortComponent);
    }

    remove(this._loadingComponent);
    remove(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SortTypes.DAY.name;
    }
  }

  _renderEvents(events) {
    render(this._tripEventsContainer, this._eventsComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => this._renderEvent(event));
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }
}
