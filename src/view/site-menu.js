import AbstractView from "./abstract";

const createSiteMenuTemplate = () => {
  return `<div>
    <h2 class="visually-hidden">Switch11 trip view</h2>
    <!-- Меню -->
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
  </div>`;
};

export default class SiteMenuView extends AbstractView {
  getTemplate() {
    return createSiteMenuTemplate();
  }
}
