import {SORT, SORT_DISABLED} from "../mock/const";

const createEventOffersTemplate = (sortItems) => {
  return sortItems.map((sortItem) => {
    const sortItemToLowerCase = sortItem.toLowerCase();

    return (
      `<div class="trip-sort__item  trip-sort__item--${sortItemToLowerCase}">
        <input id="sort-${sortItemToLowerCase}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItemToLowerCase}" ${SORT_DISABLED.includes(sortItem) ? `disabled` : ``}>
        <label class="trip-sort__btn" for="sort-${sortItemToLowerCase}">${sortItem}</label>
      </div>`
    );
  }).join(``);
};

export const createTripSortTemplate = () => {
  const sortTemplate = createEventOffersTemplate(SORT);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortTemplate}
  </form>`;
};
