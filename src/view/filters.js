import {FILTERS} from "../mock/const";
import AbstractView from "./abstract";

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

export const createFiltersTemplate = () => {
  const filtersTemplate = createEventOffersTemplate(FILTERS);

  return `<div>
    <h2 class="visually-hidden">Filter events</h2>
    <!-- Фильтры -->
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
};

export default class FiltersView extends AbstractView {
  getTemplate() {
    return createFiltersTemplate();
  }
}
