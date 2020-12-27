import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {OFFERS} from "../mock/const.js";
import {getRandomInt} from "./common.js";
dayjs.extend(duration);

export const humanizeDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getEventDuration = (dateStart, dateEnd) => {
  return dayjs(dateEnd).diff(dayjs(dateStart));
};

export const humanizeEventDuration = (eventDuration) => {
  const currentDuration = dayjs.duration(eventDuration);
  const days = currentDuration.days();
  const hours = currentDuration.hours();
  const minutes = currentDuration.minutes();

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
  const possibleOffers = OFFERS.find((offer) => offer.type === type);
  const currentOffers = possibleOffers && possibleOffers.offers || [];

  return currentOffers;
};

export const generateOffers = (type) => {
  let currentOffers = [];
  const possibleOffers = OFFERS.find((offer) => offer.type === type);

  if (possibleOffers && possibleOffers.offers) {
    for (let offer of possibleOffers.offers) {
      currentOffers.push({
        title: offer.title,
        price: offer.price,
        isChecked: Boolean(getRandomInt(0, 1))
      });
    }
  }

  return currentOffers;
};

export const sortEventsByPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};

export const sortEventsByDuration = (eventA, eventB) => {
  const durationA = getEventDuration(eventA.date.start, eventA.date.end);
  const durationB = getEventDuration(eventB.date.start, eventB.date.end);

  return durationB - durationA;
};

export const sortEventsByDate = (eventA, eventB) => {
  return eventA.date.start.getTime() - eventB.date.start.getTime();
};
