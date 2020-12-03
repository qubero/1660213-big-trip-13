import {OFFERS} from "./const";

export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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
