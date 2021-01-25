import {TripFilters} from "../const.js";

export const filter = {
  [TripFilters.ALL]: (events) => events,
  [TripFilters.FUTURE]: (events) => events.filter((event) => event.date.start > Date.now()),
  [TripFilters.PAST]: (events) => events.filter((event) => event.date.end < Date.now()),
};
