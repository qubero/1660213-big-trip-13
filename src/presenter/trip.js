import TripSortView from "../view/trip-sort";
import EventsListView from "../view/events-list";
import NoEventsView from "../view/no-events";
import TripEventPresenter from "./trip-event";
import TripEventNewPresenter from "./trip-event-new";
import {render, RenderPosition, remove} from "../utils/render";
import {SORT_TYPES, UserAction, UpdateType} from "../mock/const";
import {sortEventsByPrice, sortEventsByDuration, sortEventsByDate} from "../utils/event";
import {filter} from "../utils/filter";

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SORT_TYPES.DAY.name;

    this._tripEventsContainer = tripContainer.querySelector(`.trip-events`);
    this._tripSortComponent = null;
    this._EventsComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new TripEventNewPresenter(this._EventsComponent, this._handleViewAction);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._EventsComponent);

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
      case SORT_TYPES.PRICE.name:
        return filteredEvents.sort(sortEventsByPrice);
      case SORT_TYPES.TIME.name:
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
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
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

    if (!tripEvents.length) {
      this._renderNoEvents();
    } else {
      this._renderTripSort();
      this._renderEvents(tripEvents);
    }
  }

  _renderTripSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new TripEventPresenter(this._EventsComponent, this._handleViewAction, this._handleModeChange);
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

    remove(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SORT_TYPES.DAY.name;
    }
  }

  _renderEvents(events) {
    render(this._tripEventsContainer, this._EventsComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => this._renderEvent(event));
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }
}
