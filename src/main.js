import SiteMenuView from "./view/site-menu.js";
import StatsView from "./view/stats.js";
import {events} from "./mock/event.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import TripEventsPresenter from "./presenter/trip.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import {MenuItem, UpdateType, FILTERS} from "./mock/const.js";

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main>.page-body__container`);
const siteMenuComponent = new SiteMenuView();

render(сontrolsElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);
const filterPresenter = new FilterPresenter(сontrolsElement, filterModel, eventsModel);
const tripEventsPresenter = new TripEventsPresenter(siteMainElement, eventsModel, filterModel);

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

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripInfoPresenter.init();
tripEventsPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.ADD_NEW_EVENT);
});
