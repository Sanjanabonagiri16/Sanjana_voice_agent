import React from 'react';
import { Button } from '@/components/ui/button';
import { Gauge } from 'lucide-react';

interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [
  { label: 'Slower', value: 0.75, icon: '🐢' },
  { label: 'Normal', value: 1.0, icon: '▶️' },
  { label: 'Faster', value: 1.25, icon: '🐇' },
];

export const SpeedControl: React.FC<SpeedControlProps> = ({ 
  currentSpeed, 
  onSpeedChange 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Gauge className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground font-medium">Speed:</span>
      <div className="flex gap-1">
        {speedOptions.map((option) => (
          <Button
            key={option.value}
            variant={currentSpeed === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSpeedChange(option.value)}
            className="text-xs h-7 px-2"
            aria-label={`Set speed to ${option.label}`}
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
