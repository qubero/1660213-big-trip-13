import {createTripInfoTemplate} from "./view/trip-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createEventFilterTemplate} from "./view/event-filter.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createEventsListTemplate} from "./view/events-list.js";
import {createEventTemplate} from "./view/event.js";
import {createEventAddTemplate} from "./view/event-add.js";
import {createEventEditTemplate} from "./view/event-edit.js";

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const tripElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripElement, createTripInfoTemplate(), `afterbegin`);
render(сontrolsElement, createSiteMenuTemplate(), `beforeend`);
render(сontrolsElement, createEventFilterTemplate(), `beforeend`);

render(tripEventsElement, createTripSortTemplate(), `beforeend`);
render(tripEventsElement, createEventsListTemplate(), `beforeend`);

const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEventAddTemplate(), `beforeend`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate(), `beforeend`);
}

render(tripEventsListElement, createEventEditTemplate(), `beforeend`);
