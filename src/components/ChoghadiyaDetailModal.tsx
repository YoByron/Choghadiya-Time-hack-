import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Activity, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Period {
  name: string;
  meaning: string;
  effect: 'Good' | 'Bad' | 'Neutral';
  works: string;
  start: Date;
  end: Date;
  isDay: boolean;
}

interface ChoghadiyaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: Period;
}

const ChoghadiyaDetailModal: React.FC<ChoghadiyaDetailModalProps> = ({ isOpen, onClose, period }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            {period.name} - {period.meaning}
            {period.effect === 'Good' ? <ThumbsUp className="ml-2 text-green-500" /> : 
             period.effect === 'Bad' ? <ThumbsDown className="ml-2 text-red-500" /> : 
             null}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-4 space-y-4">
          <div className="flex items-center">
            <Clock className="mr-2" />
            <span>{period.start.toLocaleTimeString()} - {period.end.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <Activity className="mr-2" />
            <span>Recommended works: {period.works}</span>
          </div>
          <p>It's particularly suitable for: {period.works}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside">
              <li>Plan {period.effect === 'Good' ? 'important' : 'routine'} tasks during this time</li>
              <li>{period.effect === 'Good' ? 'Ideal' : 'Be cautious'} for starting new ventures</li>
              <li>Consider the nature of your activities in relation to the period's characteristics</li>
            </ul>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ChoghadiyaDetailModal;