import {createElement} from "../utils";
import {SORTS, SORTS_DISABLED} from "../mock/const";

const createSortsTemplate = (sortItems) => {
  return sortItems.map((sortItem) => {
    const sortItemToLowerCase = sortItem.toLowerCase();

    return (
      `<div class="trip-sort__item  trip-sort__item--${sortItemToLowerCase}">
        <input id="sort-${sortItemToLowerCase}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItemToLowerCase}" ${SORTS_DISABLED.includes(sortItem) ? `disabled` : ``}>
        <label class="trip-sort__btn" for="sort-${sortItemToLowerCase}">${sortItem}</label>
      </div>`
    );
  }).join(``);
};

const createTripSortTemplate = () => {
  const sortTemplate = createSortsTemplate(SORTS);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortTemplate}
  </form>`;
};

export default class TripSortView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripSortTemplate();
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
