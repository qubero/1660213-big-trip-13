import {getOffersByType, humanizeDate} from "../utils/event.js";
import {EventTypes} from "../const.js";
import Smart from "./smart.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: EventTypes.TAXI,
  date: null,
  price: null,
  offers: [],
  destination: {
    city: ``,
    description: ``,
    photos: []
  },
  isFavorite: false
};

const flatpickrInitSettings = {
  enableTime: true,
  [`time_24hr`]: true,
  dateFormat: `d/m/y H:i`,
};

const DATE_NOW = new Date().setHours(12, 0, 0, 0);

const isSubmitDisabled = (data) => {
  if (!data.date || !data.date.start || !data.date.end || !data.price || !data.destination.city) {
    return true;
  }

  return false;
};

const createEventTypesTemplate = (types, curType) => {
  return Object.values(types).map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === curType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" style="text-transform:capitalize;">${type}</label>
    </div>`
  )).join(``);
};

const createEventCitiesTemplate = (cities) => {
  return cities.map((city) => (
    `<option value="${city}"></option>`
  )).join(``);
};

const createEventOffersTemplate = (availableOffers, offers, type) => {
  const curOffers = availableOffers.map((availableOffer, index) => {
    const isChecked = offers
      .map((offer) => JSON.stringify(offer))
      .some((offer) => offer === JSON.stringify(availableOffer));

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${type}-${index}">
          <span class="event__offer-title">${availableOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${availableOffer.price}</span>
        </label>
      </div>`
    );
  }).join(``);

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
        `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`
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

export const createEventEditTemplate = (data = {}, allOffers, allDestinations) => {
  const {
    type,
    offers,
    destination,
    price,
    date,
    isNew,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  const availableOffers = getOffersByType(allOffers, type);
  const cities = allDestinations.map((curDestination) => curDestination.name);
  const isDescription = !!destination.description;
  const isPhotos = !!destination.photos.length;

  const typesTemplate = createEventTypesTemplate(EventTypes, type);
  const citiesTemplate = createEventCitiesTemplate(cities);
  const offersTemplate = availableOffers.length ? createEventOffersTemplate(availableOffers, offers, type) : ``;
  const destinationTemplate = createEventDestinationTemplate(destination, isPhotos, isDescription);

  const getResetBtnText = () => {
    if (isNew) {
      return `Cancel`;
    } else if (isDeleting) {
      return `Deleting...`;
    }

    return `Delete`;
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <fieldset ${isDisabled ? `disabled` : ``}>
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
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
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.city : ``}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${citiesTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date && date.start ? humanizeDate(date.start, `DD/MM/YY HH:mm`) : ``}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date && date.end ? humanizeDate(date.end, `DD/MM/YY HH:mm`) : ``}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price || ``}" required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? `Saving...` : `Save`}</button>
          <button class="event__reset-btn" type="reset">${getResetBtnText()}</button>
          <button class="event__rollup-btn" ${isNew ? `style="display: none!important;"` : ``} type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}

          ${destinationTemplate}
        </section>
      </fieldset>
    </form>
  </li>`;
};

export default class EventEdit extends Smart {
  constructor(event = BLANK_EVENT, offersModel, destinationsModel, isNew = false) {
    super();
    this._data = Object.assign({}, EventEdit.parseEventToData(event, isNew));
    this._submitBtn = null;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._offersModel = offersModel;
    this._allOffers = offersModel.getOffers();
    this._allDestinations = destinationsModel.getDestinations();

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._eventTypeSelectHandler = this._eventTypeSelectHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._setSubmitBtn();
    this._setInnerHandllers();
    this._setDatepickers();
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  reset(event) {
    this.updateData(
        EventEdit.parseEventToData(event)
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data, this._allOffers, this._allDestinations);
  }

  restoreHandlers() {
    this._setSubmitBtn();
    this._setInnerHandllers();
    this._setDatepickers();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setSubmitBtn() {
    this._submitBtn = this.getElement().querySelector(`.event__save-btn`);
    this._submitBtn.disabled = isSubmitDisabled(this._data);
  }

  _setDatepickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign(
            {},
            flatpickrInitSettings,
            {
              defaultDate: this._data.date ? this._data.date.start : null,
              onChange: this._startDateChangeHandler
            }
        )
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign(
            {},
            flatpickrInitSettings,
            {
              defaultDate: this._data.date ? this._data.date.end : null,
              onChange: this._endDateChangeHandler
            }
        )
    );
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

      this.updateData({
        type: newType
      });
    }
  }

  _eventDestinationChangeHandler(evt) {
    const newDestinationName = evt.target.value;
    const newDestination = this._allDestinations.find((destination) => destination.name === newDestinationName);

    if (!newDestination) {
      evt.target.setCustomValidity(`Choose actual destination`);
      evt.target.style.outline = `2px solid red`;
      evt.target.reportValidity();
      this._submitBtn.disabled = true;

      return;
    }

    this.updateData({
      destination: {
        city: newDestination.name,
        description: newDestination.description,
        photos: newDestination.pictures
      }
    });

    this._submitBtn.disabled = isSubmitDisabled(this._data);
  }

  _startDateChangeHandler([userDate]) {
    if (!this._data.date || (this._data.date.start && !this._data.date.end)) {
      this.updateData({
        date: {
          start: userDate || null,
          end: null
        }
      });

      this._submitBtn.disabled = isSubmitDisabled(this._data);

      return;
    }

    if (!this._data.date.start && this._data.date.end) {
      let newEndDate = null;

      if (userDate && userDate > this._data.date.end) {
        const datesInterval = Math.abs(this._data.date.end.getTime() - DATE_NOW);
        newEndDate = new Date(userDate.getTime() + datesInterval);
      }

      this.updateData({
        date: {
          start: userDate || null,
          end: newEndDate || this._data.date.end
        }
      });

      this._submitBtn.disabled = isSubmitDisabled(this._data);

      return;
    }

    if (this._data.date.start && this._data.date.end) {
      if (userDate && userDate > this._data.date.end) {
        const datesInterval = Math.abs(this._data.date.end.getTime() - this._data.date.start.getTime());
        const newEndDate = new Date(userDate.getTime() + datesInterval);

        this.updateData({
          date: {
            start: userDate,
            end: newEndDate
          }
        });
      } else {
        this.updateData({
          date: {
            start: userDate || null,
            end: this._data.date.end
          }
        });
      }

      this._submitBtn.disabled = isSubmitDisabled(this._data);
    }
  }

  _endDateChangeHandler([userDate]) {
    if (!this._data.date || (this._data.date.end && !this._data.date.start)) {
      this.updateData({
        date: {
          start: null,
          end: userDate || null
        }
      });

      this._submitBtn.disabled = isSubmitDisabled(this._data);

      return;
    }

    if (this._data.date.start && !this._data.date.end) {
      let newStartDate = null;

      if (userDate && userDate < this._data.date.start) {
        const datesInterval = Math.abs(this._data.date.start.getTime() - DATE_NOW);
        newStartDate = new Date(userDate.getTime() - datesInterval);
      }

      this.updateData({
        date: {
          start: newStartDate || this._data.date.start,
          end: userDate || null
        }
      });

      this._submitBtn.disabled = isSubmitDisabled(this._data);

      return;
    }

    if (this._data.date.start && this._data.date.end) {
      if (userDate && userDate < this._data.date.start) {
        const datesInterval = Math.abs(this._data.date.end.getTime() - this._data.date.start.getTime());
        const newStartDate = new Date(userDate.getTime() - datesInterval);

        this.updateData({
          date: {
            start: newStartDate,
            end: userDate
          }
        });
      } else {
        this.updateData({
          date: {
            start: this._data.date.start,
            end: userDate || null
          }
        });
      }

      this._submitBtn.disabled = isSubmitDisabled(this._data);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);

    this._submitBtn.disabled = isSubmitDisabled(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const currentOffers = this.getElement().querySelectorAll(`input.event__offer-checkbox`);

    if (currentOffers.length) {
      const newOffers = [];
      const availableOffers = getOffersByType(this._allOffers, this._data.type);

      availableOffers.forEach((offer, index) => {
        if (currentOffers[index].checked) {
          newOffers.push(offer);
        }
      });

      this.updateData({
        offers: newOffers
      });
    }

    this._callback.formSubmit(EventEdit.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parseEventToData(event, isNew) {
    return Object.assign(
        {},
        event,
        {
          isNew,
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isNew;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
