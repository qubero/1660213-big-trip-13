export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export const Filters = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortTypes = {
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

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};
