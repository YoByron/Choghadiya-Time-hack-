import React from 'react';

interface ChoghadiyaWidgetProps {
  currentPeriod: any;
  nextPeriod: any;
}

const ChoghadiyaWidget: React.FC<ChoghadiyaWidgetProps> = ({ currentPeriod, nextPeriod }) => {
  return (
    <div className="widget">
      <h3>Current Choghadiya</h3>
      <p>{currentPeriod.name} - {currentPeriod.meaning}</p>
      <h3>Next Choghadiya</h3>
      <p>{nextPeriod.name} - {nextPeriod.meaning}</p>
    </div>
  );
};

export default ChoghadiyaWidget;