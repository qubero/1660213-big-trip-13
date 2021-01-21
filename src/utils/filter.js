import {Filters} from "../const.js";

export const filter = {
  [Filters.ALL]: (events) => events,
  [Filters.FUTURE]: (events) => events.filter((event) => event.date.start > Date.now()),
  [Filters.PAST]: (events) => events.filter((event) => event.date.end < Date.now()),
};
