import Observer from "../utils/observer.js";
import {Filters} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = Filters.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
