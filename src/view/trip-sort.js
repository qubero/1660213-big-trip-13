import {SORT_TYPES} from "../const.js";
import AbstractView from "./abstract.js";

const createSortsTemplate = (sortTypes, currentSortType) => {
  return Object.values(sortTypes).map((sortType) => {
    const sortTypeNameToLowerCase = sortType.name.toLowerCase();

    return (
      `<div class="trip-sort__item  trip-sort__item--${sortTypeNameToLowerCase}">
        <input
          id="sort-${sortTypeNameToLowerCase}"
          data-sort-type="${sortType.name}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${sortTypeNameToLowerCase}"
          ${sortType.name === currentSortType ? `checked` : ``}
          ${!sortType.isSortable ? `disabled` : ``}
        />
        <label class="trip-sort__btn" for="sort-${sortTypeNameToLowerCase}">${sortType.name}</label>
      </div>`
    );
  }).join(``);
};

const createTripSortTemplate = (currentSortType) => {
  const sortTemplate = createSortsTemplate(SORT_TYPES, currentSortType);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortTemplate}
  </form>`;
};

export default class TripSortView extends AbstractView {
  constructor(sortType) {
    super();

    this._currentSortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.name !== `trip-sort`) {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
