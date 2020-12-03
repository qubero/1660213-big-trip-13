import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {getOffers} from '../mock/utils.js';

export const getEventDuration = (startDate, endDate) => {
  const eventDuration = dayjs.duration(endDate.diff(startDate));
  const days = eventDuration.days();
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  const addZero = (num) => {
    return (num < 10 ? `0${num}` : `${num}`);
  };

  return (
    `${(days > 0 && addZero(days) + `D`) || ``}
    ${(hours > 0 && addZero(hours) + `H`) || ``}
    ${addZero(minutes)}M`
  );
};

const createEventOffersTemplate = (offers) => {
  return offers.map((offer) => (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  )).join(``);
};

export const createEventTemplate = (event) => {
  const {type, destination, price, isFavorite, date} = event;
  const dateStart = dayjs(date.start);
  const dateEnd = dayjs(date.end);
  const eventDuration = getEventDuration(dateStart, dateEnd);
  const currentOffers = getOffers(type);
  const eventOffersTemplate = createEventOffersTemplate(currentOffers);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateStart.format(`YYYY-MM-DD`)}">${dateStart.format(`MMM-DD`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type + ` ` + destination.city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateStart.format(`YYYY-MM-DDTHH:mm`)}">${dateStart.format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateEnd.format(`YYYY-MM-DDTHH:mm`)}">${dateEnd.format(`HH:mm`)}</time>
        </p>
        <p class="event__duration">${eventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${eventOffersTemplate}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
