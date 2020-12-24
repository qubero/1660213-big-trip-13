import SiteMenuView from "./view/site-menu.js";
import FiltersView from "./view/filters.js";
import {events} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import TripEventsPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/trip-info.js";

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement);
const tripEventsPresenter = new TripEventsPresenter(siteMainElement);

render(сontrolsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(сontrolsElement, new FiltersView(), RenderPosition.BEFOREEND);

tripInfoPresenter.init(events);
tripEventsPresenter.init(events);
