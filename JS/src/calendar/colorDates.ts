import moment from 'moment';
import { DGEventBase } from '../charts/types/DGEvents';

export const colorDates = (data: DGEventBase[]) => {
  const dateArray: Date[] = data.reduce((arr, item) => {
    return [...arr, new Date(item.dateTimeFrom)];
  }, []);

  dateArray.forEach((d) => {
    const formattedDate = moment(d).format('dddd, DD MMMM YYYY');
    const elem = document.querySelector(`[aria-label='${formattedDate}']`);
    elem?.classList.add('has-items');
  });
};
