import dayjs from 'dayjs';

const getTripTitle = (events) => {
  const MAX_CITIES = 3;

  if (events.length > MAX_CITIES) {
    return `${events[0].destination.city} &mdash; ... &mdash; ${events[events.length - 1].destination.city}`;
  }

  const cities = events.map(({destination}) => destination.city);

  return cities.join(` &mdash; `);
};

const getTripDates = (events) => {
  const dateStart = dayjs(events[0].date.start);
  const dateEnd = dayjs(events[events.length - 1].date.end);

  return `${dateStart.format(`MMM-DD`)}&nbsp;&mdash;&nbsp;${dateEnd.format(`MMM-DD`)}`;
};

export const createTripInfoTemplate = (events) => {
  const tripTitle = getTripTitle(events);
  const tripDates = getTripDates(events);
  const totalCost = events.reduce((total, curEvnt) => total + curEvnt.price, 0);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripTitle}</h1>

      <p class="trip-info__dates">${tripDates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  </section>`;
};
