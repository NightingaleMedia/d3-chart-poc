import {colorDates} from "./colorDates.js";
export const calObserver = (element, callback) => {
  const obs = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "attributes") {
        callback(mutation);
      }
    });
  });
  obs.observe(element, {attributes: true});
};
export class CalendarDispatch {
  constructor({dataElementId}) {
    this.colorFunction = colorDates;
    this._dataElementId = dataElementId;
    this._dataElement = document.querySelector(`#${this._dataElementId}`);
    this.data = this.getData();
    this.callFunction();
    calObserver(this._dataElement, (v) => {
      this.data = this.getData();
      this.updateDates(v);
    });
  }
  callFunction() {
    this.colorFunction(this.data);
  }
  getData() {
    const value = document.querySelector(`#${this._dataElementId}`);
    if (value.dataset.dateData) {
      return JSON.parse(value.dataset.dateData);
    } else
      return [];
  }
  updateDates(d) {
    console.log("updating calendar");
    console.log("with data: ", this.data);
    this.colorFunction(this.data);
  }
}
export const callColorDate = (DATA_DIV_ID) => {
  new CalendarDispatch({
    dataElementId: DATA_DIV_ID
  });
};
