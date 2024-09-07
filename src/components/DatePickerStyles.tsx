import React from 'react';

const DatePickerStyles = () => (
  <style jsx global>{`
    .react-datepicker {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 0.8rem;
      border: 1px solid #aeaeae;
      border-radius: 0.3rem;
      display: inline-block;
      position: relative;
    }

    .react-datepicker__header {
      text-align: center;
      border-bottom: 1px solid #aeaeae;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      padding-top: 8px;
      position: relative;
    }

    .react-datepicker__current-month {
      margin-top: 0;
      font-weight: bold;
      font-size: 0.944rem;
    }

    .react-datepicker__day-names, .react-datepicker__week {
      white-space: nowrap;
    }

    .react-datepicker__day-name, .react-datepicker__day {
      display: inline-block;
      width: 1.7rem;
      line-height: 1.7rem;
      text-align: center;
      margin: 0.166rem;
    }

    .react-datepicker__day:hover {
      border-radius: 0.3rem;
      background-color: #f0f0f0;
    }

    .react-datepicker__day--selected {
      border-radius: 0.3rem;
      background-color: #216ba5;
      color: #fff;
    }

    .react-datepicker__day--keyboard-selected {
      border-radius: 0.3rem;
      background-color: #2a87d0;
      color: #fff;
    }

    /* Dark mode styles */
    .dark .react-datepicker {
      background-color: #1f2937;
      color: #fff;
      border-color: #4b5563;
    }

    .dark .react-datepicker__header {
      background-color: #374151;
      border-color: #4b5563;
    }

    .dark .react-datepicker__day-name, .dark .react-datepicker__day {
      color: #fff;
    }

    .dark .react-datepicker__day:hover {
      background-color: #4b5563;
    }

    .dark .react-datepicker__day--selected, .dark .react-datepicker__day--keyboard-selected {
      background-color: #3b82f6;
    }
  `}</style>
);

export default DatePickerStyles;