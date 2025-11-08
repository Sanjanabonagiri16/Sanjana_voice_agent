import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const GreetingCard: React.FC = () => {
  return (
    <Card className="p-6 w-full bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 animate-fade-in">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary mt-0.5 animate-pulse" />
        <div>
          <h3 className="font-semibold text-foreground mb-2 text-lg">
            Hi — I'm Bonagiri Sanjana
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Python Developer & Full Stack Engineer with 2+ years of experience · 70+ completed projects · 10 SaaS products
          </p>
          <p className="text-sm text-muted-foreground">
            Tap the mic and ask me an interview question (or type). Try: <span className="font-medium text-primary">"What's your #1 superpower as a developer?"</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
