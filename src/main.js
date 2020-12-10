import SiteMenuView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import EventFilterView from "./view/event-filter.js";
import TripSortView from "./view/trip-sort.js";
import EventsListView from "./view/events-list.js";
import EventEditView from "./view/event-edit.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition, replace} from "./utils/render.js";
import EventView from "./view/event.js";
import NoEventsView from "./view/no-events.js";

const EVENTS_COUNT = 10;

const sortEventsByDate = (a, b) => {
  return a.date.end.getTime() - b.date.end.getTime();
};

const renderEvent = (eventsListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replacePointToForm = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToPoint = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setRollupClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
};

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);
const eventsByDate = [...events].slice().sort(sortEventsByDate);

const siteHeaderElement = document.querySelector(`.page-header`);
const tripElement = siteHeaderElement.querySelector(`.trip-main`);
const сontrolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

if (eventsByDate.length) {
  render(tripElement, new TripInfoView(eventsByDate), RenderPosition.AFTERBEGIN);
  render(сontrolsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
  render(сontrolsElement, new EventFilterView(), RenderPosition.BEFOREEND);
  render(tripEventsElement, new TripSortView(), RenderPosition.BEFOREEND);

  const tripEventsList = new EventsListView();
  render(tripEventsElement, tripEventsList, RenderPosition.BEFOREEND);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    renderEvent(tripEventsList.getElement(), eventsByDate[i]);
  }
} else {
  render(tripEventsElement, new NoEventsView(), RenderPosition.BEFOREEND);
}
