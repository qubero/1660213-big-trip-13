import {SORTS, SORTS_DISABLED} from "../mock/const";
import AbstractView from "./abstract";

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

export default class TripSortView extends AbstractView {
  getTemplate() {
    return createTripSortTemplate();
  }
}
