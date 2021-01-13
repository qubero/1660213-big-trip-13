export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
export const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`];

export const FILTERS = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SORT_TYPES = {
  DAY: {name: `Day`, isSortable: true},
  EVENT: {name: `Event`, isSortable: false},
  TIME: {name: `Time`, isSortable: true},
  PRICE: {name: `Price`, isSortable: true},
  OFFERS: {name: `Offers`, isSortable: false},
};

export const MenuItem = {
  ADD_NEW_EVENT: `ADD_NEW_EVENT`,
  TABLE: `EVENTS`,
  STATS: `STATS`
};

export const OFFERS = [
  {
    type: `taxi`,
    offers: [
      {title: `Order Uber`, price: 20}
    ]
  }, {
    type: `drive`,
    offers: [
      {title: `Rent a car`, price: 200}
    ]
  }, {
    type: `check-in`,
    offers: [
      {title: `Add breakfast`, price: 50}
    ]
  }, {
    type: `sightseeing`,
    offers: [
      {title: `Book tickets`, price: 30},
      {title: `Lunch in city`, price: 40}
    ]
  }, {
    type: `flight`,
    offers: [
      {title: `Add luggage`, price: 50},
      {title: `Switch to comfort`, price: 80},
      {title: `Add meal`, price: 15},
      {title: `Choose seats`, price: 5},
      {title: `Travel by train`, price: 40}
    ]
  }
];

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};
