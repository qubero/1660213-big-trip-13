import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {OFFERS} from "../mock/const.js";
import {getRandomInt} from "./common.js";
dayjs.extend(duration);

export const humanizeDate = (date, format) => {
  return dayjs(date).format(format);
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
