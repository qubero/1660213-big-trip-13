import {render, RenderPosition, replace, remove} from "../utils/render.js";
import Filters from "../view/filters.js";
import {UpdateType, TripFilters} from "../const.js";
import {filter} from "../utils/filter.js";

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new Filters(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();

    return [
      {
        type: TripFilters.ALL,
        name: `Everything`,
        isDisabled: !(filter[TripFilters.ALL](events).length)
      },
      {
        type: TripFilters.FUTURE,
        name: `Future`,
        isDisabled: !(filter[TripFilters.FUTURE](events).length)
      },
      {
        type: TripFilters.PAST,
        name: `Past`,
        isDisabled: !(filter[TripFilters.PAST](events).length)
      },
    ];
  }
}
