import TripSortView from "../view/trip-sort";
import EventsListView from "../view/events-list";
import NoEventsView from "../view/no-events";
import TripEventPresenter from "./trip-event";
import {render, RenderPosition} from "../utils/render";
import {updateItem} from "../utils/common";
import {SORT_TYPES} from "../mock/const";
import {sortEventsByPrice, sortEventsByDuration} from "../utils/event";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._currentSortType = SORT_TYPES.DAY;

    this._tripEventsContainer = tripContainer.querySelector(`.trip-events`);
    this._tripSortComponent = new TripSortView();
    this._EventsComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripEvents) {
    this._tripEvents = tripEvents.slice();
    this._sourcedTripEvents = tripEvents.slice();

    if (!this._tripEvents.length) {
      this._renderNoEvents();
    } else {
      this._renderTripSort();
      this._renderEvents();
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._tripEvents = updateItem(this._tripEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SORT_TYPES.PRICE.name:
        this._tripEvents.sort(sortEventsByPrice);
        break;
      case SORT_TYPES.TIME.name:
        this._tripEvents.sort(sortEventsByDuration);
        break;
      default:
        this._tripEvents = this._sourcedTripEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType.name === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEvents();
    this._renderEvents();
  }

  _renderTripSort() {
    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.BEFOREEND);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(event) {
    const eventPresenter = new TripEventPresenter(this._EventsComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearEvents() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};
  }

  _renderEvents() {
    render(this._tripEventsContainer, this._EventsComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < this._tripEvents.length; i++) {
      this._renderEvent(this._tripEvents[i]);
    }
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }
}
