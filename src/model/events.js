import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          date: {
            start: dayjs(event.date_from).toDate(),
            end: dayjs(event.date_to).toDate()
          },
          price: event.base_price,
          destination: {
            city: event.destination.name,
            description: event.destination.description,
            photos: event.destination.pictures
          },
          isFavorite: event.is_favorite
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.destination.name;
    delete adaptedEvent.destination.pictures;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          [`date_from`]: event.date.start.toISOString(),
          [`date_to`]: event.date.end.toISOString(),
          [`base_price`]: event.price,
          destination: {
            name: event.destination.city,
            description: event.destination.description,
            pictures: event.destination.photos
          },
          [`is_favorite`]: event.isFavorite
        }
    );

    delete adaptedEvent.price;
    delete adaptedEvent.date;
    delete adaptedEvent.destination.city;
    delete adaptedEvent.destination.photos;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
