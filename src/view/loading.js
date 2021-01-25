import Abstract from "./abstract";

const createTripInfoTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class Loading extends Abstract {
  getTemplate() {
    return createTripInfoTemplate();
  }
}
