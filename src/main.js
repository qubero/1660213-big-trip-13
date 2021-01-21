import {MenuItem, UpdateType, Filters} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {toast} from "./utils/toast/toast.js";
import {isOnline} from "./utils/common.js";

import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";

import SiteMenuView from "./view/site-menu.js";
import StatsView from "./view/stats.js";

import TripEventsPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import FilterPresenter from "./presenter/filter.js";

import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic ef090wi25k8998a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

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
const tripEventsPresenter = new TripEventsPresenter(siteMainElement, eventsModel, filterModel, offersModel, destinationsModel, apiWithProvider);

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      if (document.querySelector(`.statistics`)) {
        remove(statsComponent);
        tripEventsPresenter.destroy();
        filterModel.setFilter(UpdateType.MAJOR, Filters.ALL);
        tripEventsPresenter.init();
      } else {
        filterModel.setFilter(UpdateType.MAJOR, Filters.ALL);
      }
      if (!isOnline()) {
        toast(`You can't create new event offline`);
        break;
      }
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripEventsPresenter.createEvent();
      break;
    case MenuItem.TABLE:
      remove(statsComponent);
      filterModel.setFilter(UpdateType.MAJOR, Filters.ALL);
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
    apiWithProvider.getEvents(),
    isOnline() ? api.getOffers() : Promise.resolve([]),
    isOnline() ? api.getDestinations() : Promise.resolve([])
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);

  if (!isOnline()) {
    document.title += ` [offline]`;
  }
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
