import {getOffers, humanizeDate} from "../utils/event.js";
import {CITIES, EVENT_TYPES} from "../mock/const.js";
import AbstractView from "./abstract";

const BLANK_EVENT = {
  type: EVENT_TYPES[0],
  date: null,
  price: null,
  destination: {
    city: null,
    description: null,
    photos: []
  },
  isFavorite: false
};

const createEventTypesTemplate = (types) => {
  return types.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  )).join(``);
};

const createEventCitiesTemplate = (cities) => {
  return cities.map((city) => (
    `<option value="${city}"></option>`
  )).join(``);
};

const createEventOffersTemplate = (offers) => {
  const curOffers = offers.map((offer) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}" ${offer.isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.name}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  )).join(``);

  return (
    curOffers.length
      ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${curOffers}
        </div>
      </section>`
      : ``
  );
};

const createEventDestinationTemplate = (destination) => {
  const createEventPhotosTemplate = (photos) => {
    return photos.map((photo) => (
      `<img class="event__photo" src=${photo} alt="Event photo"></img>`
    )).join(``);
  };

  const photosTemplate = createEventPhotosTemplate(destination.photos);

  return (
    (destination.photos.length || destination.description)
      ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">${destination.city}</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosTemplate}
            </div>
          </div>
        </section>`
      : ``
  );
};

export const createEventEditTemplate = (event = {}) => {
  const {type, destination, price, date} = event;
  const currentType = !type ? EVENT_TYPES[0] : type;
  const currentOffers = getOffers(currentType);

  const typesTemplate = createEventTypesTemplate(EVENT_TYPES);
  const citiesTemplate = createEventCitiesTemplate(CITIES);
  const offersTemplate = createEventOffersTemplate(currentOffers);
  const destinationTemplate = destination ? createEventDestinationTemplate(destination) : ``;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${currentType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.city : ``}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${citiesTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date ? humanizeDate(date.start, `DD/MM/YY HH:mm`) : ``}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date ? humanizeDate(date.end, `DD/MM/YY HH:mm`) : ``}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price || ``}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${!type ? `Cancel` : `Delete`}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}

        ${destinationTemplate}
      </section>
    </form>
  </li>`;
};

export default class EventEditView extends AbstractView {
  constructor(event = BLANK_EVENT) {
    super();
    this._event = event;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}
