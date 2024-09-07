import { createEvents } from 'ics';

export const exportToCalendar = (periods: any[]) => {
  const events = periods.map(period => ({
    start: [period.start.getFullYear(), period.start.getMonth() + 1, period.start.getDate(), period.start.getHours(), period.start.getMinutes()],
    end: [period.end.getFullYear(), period.end.getMonth() + 1, period.end.getDate(), period.end.getHours(), period.end.getMinutes()],
    title: `${period.name} Choghadiya`,
    description: `${period.meaning} - ${period.effect}`,
  }));

  createEvents(events, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'choghadiya_periods.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};