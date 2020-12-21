import SiteMenuView from "./view/site-menu.js";
import FiltersView from "./view/filters.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import TripEventsPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/trip-info.js";

const EVENTS_COUNT = 10;

const sortEventsByDate = (a, b) => {
  return a.date.end.getTime() - b.date.end.getTime();
};

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const eventsByDate = [...events].slice().sort(sortEventsByDate);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement);
const tripEventsPresenter = new TripEventsPresenter(siteMainElement);

render(сontrolsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(сontrolsElement, new FiltersView(), RenderPosition.BEFOREEND);

tripInfoPresenter.init(eventsByDate);
tripEventsPresenter.init(eventsByDate);
