import {MenuItem, UpdateType, FILTERS} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";

import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";

import SiteMenuView from "./view/site-menu.js";
import StatsView from "./view/stats.js";

import TripEventsPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import FilterPresenter from "./presenter/filter.js";

import Api from "./api.js";

const AUTHORIZATION = `Basic ef090wi25k8998a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main>.page-body__container`);
const siteMenuComponent = new SiteMenuView();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);
const filterPresenter = new FilterPresenter(сontrolsElement, filterModel, eventsModel);
const tripEventsPresenter = new TripEventsPresenter(siteMainElement, eventsModel, filterModel, offersModel, destinationsModel, api);

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      if (document.querySelector(`.statistics`)) {
        remove(statsComponent);
        tripEventsPresenter.destroy();
        filterModel.setFilter(UpdateType.MAJOR, FILTERS.ALL);
        tripEventsPresenter.init();
      } else {
        filterModel.setFilter(UpdateType.MAJOR, FILTERS.ALL);
      }
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripEventsPresenter.createEvent();
      break;
    case MenuItem.TABLE:
      remove(statsComponent);
      filterModel.setFilter(UpdateType.MAJOR, FILTERS.ALL);
      tripEventsPresenter.init();
      break;
    case MenuItem.STATS:
      tripEventsPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(siteMainElement, statsComponent, RenderPosition.AFTERBEGIN);
      break;
  }
};

tripInfoPresenter.init();
tripEventsPresenter.init();

Promise
  .all([
    api.getEvents(),
    api.getOffers(),
    api.getDestinations()
  ])
  .then(([events, offers, destinations]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(сontrolsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    filterPresenter.init();
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(сontrolsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    filterPresenter.init();
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.ADD_NEW_EVENT);
});
