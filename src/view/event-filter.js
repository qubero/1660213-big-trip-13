import {createElement} from "../utils";
import {FILTERS} from "../mock/const";

const createEventOffersTemplate = (filters) => {
  return filters.map((filter) => {
    const filterToLowerCase = filter.toLowerCase();

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filterToLowerCase}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterToLowerCase}">
        <label class="trip-filters__filter-label" for="filter-${filterToLowerCase}">${filter}</label>
      </div>`
    );
  }).join(``);
};

export const createEventFilterTemplate = () => {
  const filtersTemplate = createEventOffersTemplate(FILTERS);

  return `<h2 class="visually-hidden">Filter events</h2>
  <!-- Фильтры -->
  <form class="trip-filters" action="#" method="get">
    ${filtersTemplate}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class EventFilterView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventFilterTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
