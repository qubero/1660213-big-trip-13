import AbstractView from "./abstract";
import {MenuItem} from "../mock/const";

const createSiteMenuTemplate = () => {
  return `<div>
    <h2 class="visually-hidden">Switch trip view</h2>
    <!-- Меню -->
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>
  </div>`;
};

export default class SiteMenuView extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    this._callback.menuClick(evt.target.dataset.menuItem);
    this.setMenuItem(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    const menuTabs = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuTabs.forEach((tab) => tab.addEventListener(`click`, this._menuClickHandler));
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (item !== null) {
      this.getElement()
        .querySelectorAll(`.trip-tabs__btn`)
        .forEach((tab) => tab.classList.remove(`trip-tabs__btn--active`));

      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
