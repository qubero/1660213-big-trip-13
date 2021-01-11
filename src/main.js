import SiteMenuView from "./view/site-menu.js";
import {events} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import TripEventsPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);
const tripEventsPresenter = new TripEventsPresenter(siteMainElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(сontrolsElement, filterModel, eventsModel);

render(сontrolsElement, new SiteMenuView(), RenderPosition.BEFOREEND);

filterPresenter.init();
tripInfoPresenter.init();
tripEventsPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripEventsPresenter.createEvent();
});
