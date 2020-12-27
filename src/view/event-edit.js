import {getOffers, humanizeDate} from "../utils/event.js";
import {CITIES, EVENT_TYPES} from "../mock/const.js";
import SmartView from "./smart";
import {generateDescription, generatePhotos} from "../mock/event.js";

const BLANK_EVENT = {
  type: EVENT_TYPES[0],
  date: null,
  price: null,
  offers: [],
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
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" style="text-transform:capitalize;">${type}</label>
    </div>`
  )).join(``);
};

const createEventCitiesTemplate = (cities) => {
  return cities.map((city) => (
    `<option value="${city}"></option>`
  )).join(``);
};

const createEventOffersTemplate = (offers, type) => {
  const curOffers = offers.map((offer, index) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}" ${offer.isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${type}-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  )).join(``);

  return (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${curOffers}
        </div>
      </section>`
  );
};

const createEventDestinationTemplate = (destination, isPhotos, isDescription) => {
  const createEventPhotosTemplate = (photos) => {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos.map((photo) => (
        `<img class="event__photo" src=${photo} alt="Event photo"></img>`
      )).join(``)}
        </div>
      </div>`
    );
  };

  const photosTemplate = isPhotos ? createEventPhotosTemplate(destination.photos) : ``;

  return (
    (isPhotos || isDescription)
      ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">${destination.city}</h3>
          ${isDescription ? `<p class="event__destination-description">${destination.description}</p>` : ``}
          ${photosTemplate}
        </section>`
      : ``
  );
};

export const createEventEditTemplate = (data = {}) => {
  const {type, offers, destination, price, date, isOffers, isPhotos, isDescription} = data;
  const currentType = !type ? EVENT_TYPES[0] : type;

  const typesTemplate = createEventTypesTemplate(EVENT_TYPES);
  const citiesTemplate = createEventCitiesTemplate(CITIES);
  const offersTemplate = isOffers ? createEventOffersTemplate(offers, type) : ``;
  const destinationTemplate = createEventDestinationTemplate(destination, isPhotos, isDescription);

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

export default class EventEditView extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(event);

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._eventTypeSelectHandler = this._eventTypeSelectHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    // N.B. Реализовать во второй части дз вместо с подключением библиотек
    // this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    // this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._setInnerHandllers();
  }

  reset(event) {
    this.updateData(
        EventEditView.parseEventToData(event)
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandllers();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandllers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`input`, this._eventTypeSelectHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`input`, this._eventDestinationChangeHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  _eventTypeSelectHandler(evt) {
    if (evt.target.name === `event-type`) {
      const newType = evt.target.value;
      const newOffers = getOffers(newType);

      this.updateData({
        type: newType,
        offers: newOffers,
        isOffers: !!newOffers.length
      });
    }
  }

  _eventDestinationChangeHandler(evt) {
    const newDestination = evt.target.value;

    if (!CITIES.includes(newDestination)) {
      evt.target.setCustomValidity(`Choose actual destination`);
      evt.target.style.outline = `2px solid red`;
      evt.target.reportValidity();

      return;
    }

    this.updateData({
      destination: {
        city: newDestination,
        description: generateDescription(),
        photos: generatePhotos()
      }
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const currentOffers = this.getElement().querySelectorAll(`input.event__offer-checkbox`);

    if (currentOffers.length) {
      let newOffers = [...this._data.offers];
      newOffers.forEach((offer, index) => (offer.isChecked = currentOffers[index].checked));

      this.updateData({
        offers: newOffers
      });
    }

    this._callback.formSubmit(EventEditView.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isOffers: !!event.offers.length,
          isDescription: !!event.destination.description,
          isPhotos: !!event.destination.photos.length
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isOffers;
    delete data.isDescription;
    delete data.isPhotos;

    return data;
  }
}
