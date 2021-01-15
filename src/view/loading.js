import AbstractView from "./abstract";

const createTripInfoTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createTripInfoTemplate();
  }
}
