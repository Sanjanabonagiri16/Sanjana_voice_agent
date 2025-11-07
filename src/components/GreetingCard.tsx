import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const GreetingCard: React.FC = () => {
  return (
    <Card className="p-6 w-full bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 animate-fade-in">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary mt-0.5 animate-pulse" />
        <div>
          <h3 className="font-semibold text-foreground mb-2">
            Hi — I'm Bonagiri Sanjana
          </h3>
          <p className="text-sm text-muted-foreground">
            Tap the mic and ask me an interview question (or type). Try: <span className="font-medium text-primary">"What's your #1 superpower?"</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
