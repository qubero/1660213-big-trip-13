export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
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
  {type: `taxi`, name: `order`, title: `Order Uber`, price: `20`},
  {type: `flight`, name: `luggage`, title: `Add luggage`, price: `50`},
  {type: `flight`, name: `comfort`, title: `Switch to comfort`, price: `80`},
  {type: `drive`, name: `car`, title: `Rent a car`, price: `200`},
  {type: `check-in`, name: `breakfast`, title: `Add breakfast`, price: `50`},
  {type: `sightseeing`, name: `tickets`, title: `Book tickets`, price: `40`},
  {type: `sightseeing`, name: `lunch`, title: `Lunch in city`, price: `30`},
  {type: `flight`, name: `meal`, title: `Add meal`, price: `15`},
  {type: `flight`, name: `seats`, title: `Choose seats`, price: `5`},
  {type: `flight`, name: `train`, title: `Travel by train`, price: `40`}
];
