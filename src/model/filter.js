import Observer from "../utils/observer.js";
import {FILTERS} from "../mock/const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FILTERS.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
