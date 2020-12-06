import {createTripInfoTemplate} from "./view/trip-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createEventFilterTemplate} from "./view/event-filter.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createEventsListTemplate} from "./view/events-list.js";
import {createEventTemplate} from "./view/event.js";
import {createEventEditTemplate} from "./view/event-edit.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_COUNT = 10;

const sortEventsByDate = (a, b) => {
  return a.date.end.getTime() - b.date.end.getTime();
};

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const eventsByDate = [...events].slice().sort(sortEventsByDate);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const tripElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripElement, createTripInfoTemplate(eventsByDate), `afterbegin`);
render(сontrolsElement, createSiteMenuTemplate(), `beforeend`);
render(сontrolsElement, createEventFilterTemplate(), `beforeend`);

render(tripEventsElement, createTripSortTemplate(), `beforeend`);
render(tripEventsElement, createEventsListTemplate(), `beforeend`);

const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEventEditTemplate(eventsByDate[0]), `beforeend`);

for (let i = 1; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate(eventsByDate[i]), `beforeend`);
}

render(tripEventsListElement, createEventEditTemplate(), `beforeend`);

