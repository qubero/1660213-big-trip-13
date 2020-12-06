import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {OFFERS} from './mock/const';
import {getRandomInt} from './mock/utils';
dayjs.extend(duration);

export const humanizeDate = (date, format) => {
  return dayjs(date).format(format);
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getEventDuration = (dateStart, dateEnd) => {
  const startDate = dayjs(dateStart);
  const endDate = dayjs(dateEnd);
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

export const getOffers = (type) => {
  let currentOffers = [];
  const possibleOffers = OFFERS.filter((offer) => offer.type === type);

  for (let offer of possibleOffers) {
    currentOffers.push({
      name: offer.name,
      title: offer.title,
      price: offer.price,
      isChecked: Boolean(getRandomInt(0, 1))
    });
  }

  return currentOffers;
};
