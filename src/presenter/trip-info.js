import {render, RenderPosition} from "../utils/render";
import TripInfoView from "../view/trip-info";

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;
  }

  init(tripEvents) {
    this._tripEvents = tripEvents.slice();

    if (this._tripEvents.length > 0) {
      this._renderTripInfo();
    }
  }

  _renderTripInfo() {
    this._tripInfoView = new TripInfoView(this._tripEvents);
    render(this._tripInfoContainer, this._tripInfoView, RenderPosition.AFTERBEGIN);
  }
}
