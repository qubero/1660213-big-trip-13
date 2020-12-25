import dayjs from "dayjs";
import {getRandomInt} from "../utils/common.js";
import {EVENT_TYPES, CITIES} from "./const";
import {sortEventsByDate, getOffers} from "../utils/event.js";

const EVENTS_COUNT = 10;

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const getEventType = () => {
  const randomIndex = getRandomInt(0, EVENT_TYPES.length - 1);

  return EVENT_TYPES[randomIndex];
};

const generateDate = () => {
  const maxMintesGap = 10080;
  const minutesGap = getRandomInt(1, maxMintesGap);
  const minutesStart = getRandomInt(0, minutesGap - 1);

  const dayjsToday = dayjs();
  const start = dayjsToday.add(minutesStart, `m`).toDate();
  const end = dayjsToday.add(minutesGap, `m`).toDate();

  return {
    start,
    end
  };
};

const generateCity = () => {
  const randomIndex = getRandomInt(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

export const generateDescription = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  let description = ``;

  for (let i = 0; i <= getRandomInt(1, 5); i++) {
    description += descriptions[getRandomInt(0, descriptions.length - 1)];
  }

  return description;
};

export const generatePhotos = () => {
  let photos = [];

  for (let i = 1; i <= getRandomInt(1, 5); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

export const generateEvent = () => {
  const type = getEventType();
  return {
    id: generateId(),
    type,
    date: generateDate(),
    price: getRandomInt(20, 650),
    offers: getOffers(type),
    destination: {
      city: generateCity(),
      description: generateDescription(),
      photos: generatePhotos()
    },
    isFavorite: Boolean(getRandomInt(0, 1))
  };
};

export const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort(sortEventsByDate);
