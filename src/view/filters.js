import Abstract from "./abstract";

const createFilterItemsTemplate = (filters, currentFilterType) => {
  return filters.map((filter) => {
    const {type, name, isDisabled} = filter;
    const filterToLowerCase = type.toLowerCase();

    return (
      `<div class="trip-filters__filter">
        <input
          type="radio"
          id="filter-${filterToLowerCase}"
          class="trip-filters__filter-input  visually-hidden"
          name="trip-filter"
          ${type === currentFilterType ? `checked` : ``}
          ${isDisabled ? `disabled` : ``}
          value="${filterToLowerCase}"
        />
        <label class="trip-filters__filter-label" for="filter-${filterToLowerCase}">${name}</label>
      </div>`
    );
  }).join(``);
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = createFilterItemsTemplate(filterItems, currentFilterType);

  return `<div>
    <h2 class="visually-hidden">Filter events</h2>
    <!-- Фильтры -->
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
};

export default class Filters extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
