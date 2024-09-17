import { createEvents, DateArray } from 'ics';
import { Period } from '../types';

export const exportToCalendar = (periods: Period[]) => {
  const events = periods.map(period => {
    const startDate: DateArray = [
      period.start.getFullYear(),
      period.start.getMonth() + 1, // Month is 0-indexed in JS Date
      period.start.getDate(),
      period.start.getHours(),
      period.start.getMinutes()
    ];
    const endDate: DateArray = [
      period.end.getFullYear(),
      period.end.getMonth() + 1,
      period.end.getDate(),
      period.end.getHours(),
      period.end.getMinutes()
    ];

    return {
      start: startDate,
      end: endDate,
      title: `${period.name} Choghadiya`,
      description: `Effect: ${period.effect}, Works: ${period.works}`
    };
  });

  createEvents(events, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'choghadiya_periods.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};