import SiteMenuView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import EventFilterView from "./view/event-filter.js";
import TripSortView from "./view/trip-sort.js";
import EventsListView from "./view/events-list.js";
import EventEditView from "./view/event-edit.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils.js";
import EventView from "./view/event.js";

const EVENTS_COUNT = 10;

const sortEventsByDate = (a, b) => {
  return a.date.end.getTime() - b.date.end.getTime();
};

const renderEvent = (eventsListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replacePointToForm = () => {
    eventsListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToPoint = () => {
    eventsListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
  });

  eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(eventsListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const eventsByDate = [...events].slice().sort(sortEventsByDate);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripElement, new TripInfoView(eventsByDate).getElement(), RenderPosition.AFTERBEGIN);
render(сontrolsElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(сontrolsElement, new EventFilterView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripSortView().getElement(), RenderPosition.BEFOREEND);

const tripEventsList = new EventsListView();
render(tripEventsElement, tripEventsList.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < EVENTS_COUNT; i++) {
  renderEvent(tripEventsList.getElement(), eventsByDate[i]);
}
