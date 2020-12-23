export const EVENT_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
export const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`];
export const FILTERS = [`Everything`, `Future`, `Past`];

export const SORT_TYPES = {
  DAY: {name: `Day`, isSortable: true},
  EVENT: {name: `Event`, isSortable: false},
  TIME: {name: `Time`, isSortable: true},
  PRICE: {name: `Price`, isSortable: true},
  OFFERS: {name: `Offers`, isSortable: false},
};

export const OFFERS = [
  {type: `Taxi`, name: `order`, title: `Order Uber`, price: `20`},
  {type: `Flight`, name: `luggage`, title: `Add luggage`, price: `50`},
  {type: `Flight`, name: `comfort`, title: `Switch to comfort`, price: `80`},
  {type: `Drive`, name: `car`, title: `Rent a car`, price: `200`},
  {type: `Check-in`, name: `breakfast`, title: `Add breakfast`, price: `50`},
  {type: `Sightseeing`, name: `tickets`, title: `Book tickets`, price: `40`},
  {type: `Sightseeing`, name: `lunch`, title: `Lunch in city`, price: `30`},
  {type: `Flight`, name: `meal`, title: `Add meal`, price: `15`},
  {type: `Flight`, name: `seats`, title: `Choose seats`, price: `5`},
  {type: `Flight`, name: `train`, title: `Travel by train`, price: `40`}
];
