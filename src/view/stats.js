import AbstractView from "./abstract";
import {renderMoneyChart, renderTypeChart, renderTimeChart} from "../utils/stats";

const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class StatsView extends AbstractView {
  constructor(events) {
    super();

    this._data = events;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const types = [];
    this._data.forEach((event) => types.push(event.type.toUpperCase()));
    const labels = [...new Set(types)];

    const BAR_HEIGHT = 55;
    const LABELS_COUNT = labels.length;

    moneyCtx.height = BAR_HEIGHT * LABELS_COUNT;
    typeCtx.height = BAR_HEIGHT * LABELS_COUNT;
    timeCtx.height = BAR_HEIGHT * LABELS_COUNT;

    this._moneyChart = renderMoneyChart(moneyCtx, this._data, labels);
    this._typeChart = renderTypeChart(typeCtx, this._data, labels);
    this._timeChart = renderTimeChart(timeCtx, this._data, labels);
  }
}
