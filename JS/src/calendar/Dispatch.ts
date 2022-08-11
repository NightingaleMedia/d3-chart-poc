import { colorDates } from './colorDates';
import { DGEventBase } from '../charts/types/DGEvents';

export const calObserver = (element, callback) => {
  const obs = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes') {
        callback(mutation);
      }
    });
  });
  obs.observe(element, { attributes: true });
};

type DispatchProps = {
  dataElementId: string;
};
export class CalendarDispatch {
  _dataElement: Element;
  _dataElementId: string;
  data: DGEventBase[];
  colorFunction = colorDates;
  constructor({ dataElementId }: DispatchProps) {
    this._dataElementId = dataElementId;
    this._dataElement = document.querySelector(
      `#${this._dataElementId}`
    ) as Element;
    // console.log("this data: ", this.getData());
    this.data = this.getData();

    this.callFunction();
    calObserver(this._dataElement, (v: MutationRecord) => {
      this.data = this.getData();
      this.updateDates(v);
    });
  }

  callFunction() {
    this.colorFunction(this.data);
  }

  getData(): DGEventBase[] {
    // console.log(`get data: `, this._chartBase._name);
    const value = document.querySelector(`#${this._dataElementId}`) as any;
    if (value.dataset.dateData) {
      return JSON.parse(value.dataset.dateData) as DGEventBase[];
    } else return [];
  }

  updateDates(d: MutationRecord) {
    console.log('updating calendar');
    console.log('with data: ', this.data);
    this.colorFunction(this.data);
  }
}

export const callColorDate = (DATA_DIV_ID) => {
  new CalendarDispatch({
    dataElementId: DATA_DIV_ID,
  });
};
