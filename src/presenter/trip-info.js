import {render, RenderPosition, remove} from "../utils/render";
import TripInfoView from "../view/trip-info";
import {sortEventsByDate} from "../utils/event";

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._eventsModel = eventsModel;
    this._tripInfoContainer = tripInfoContainer;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._tripEvents = this._eventsModel.getEvents().slice().sort(sortEventsByDate);

    if (this._tripEvents.length > 0) {
      this._renderTripInfo();
    }
  }

  _handleModelEvent() {
    this._destroy();
    this.init();
  }

  _destroy() {
    if (this._tripInfoComponent === null) {
      return;
    }

    remove(this._tripInfoComponent);
    this._tripInfoComponent = null;
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._tripEvents);
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
}
