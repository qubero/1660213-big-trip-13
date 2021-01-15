import {FILTERS} from "../const.js";

export const filter = {
  [FILTERS.ALL]: (events) => events,
  [FILTERS.FUTURE]: (events) => events.filter((event) => event.date.start > Date.now()),
  [FILTERS.PAST]: (events) => events.filter((event) => event.date.end < Date.now()),
};
