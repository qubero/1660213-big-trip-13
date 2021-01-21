import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const humanizeDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getEventDuration = (dateStart, dateEnd) => {
  return dayjs(dateEnd).diff(dayjs(dateStart));
};

const addZero = (num) => {
  return (num < 10 ? `0${num}` : `${num}`);
};

export const humanizeEventDurationDays = (eventDuration) => {
  const currentDuration = dayjs.duration(eventDuration);
  const days = currentDuration.days();
  const hours = currentDuration.hours();

  return (days > 0 ? `${addZero(days)}D` : `${addZero(hours)}H`);
};

export const humanizeEventDuration = (eventDuration) => {
  const currentDuration = dayjs.duration(eventDuration);
  const days = currentDuration.days();
  const hours = currentDuration.hours();
  const minutes = currentDuration.minutes();

  return (
    `${(days > 0 && addZero(days) + `D`) || ``}
    ${(hours > 0 && addZero(hours) + `H`) || ``}
    ${addZero(minutes)}M`
  );
};

export const getOffersByType = (offers, type) => {
  const availableOffers = offers.find((offer) => offer.type === type);
  const currentOffers = availableOffers && availableOffers.offers || [];

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
