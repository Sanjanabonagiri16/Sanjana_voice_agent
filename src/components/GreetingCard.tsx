import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const GreetingCard: React.FC = () => {
  return (
    <Card className="p-8 w-full bg-gradient-to-br from-primary/10 via-accent/5 to-listening/10 border-primary/30 animate-fade-in shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2 text-2xl">
              Hi — I'm Bonagiri Sanjana 👋
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Python Developer & Full Stack Engineer with <span className="font-semibold text-foreground">2+ years of experience</span> · <span className="font-semibold text-foreground">70+ completed projects</span> · <span className="font-semibold text-foreground">10 SaaS products</span>
            </p>
            <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground">
                Tap the mic and ask me an interview question (or type). Try: <span className="font-bold text-primary">"What's your #1 superpower as a developer?"</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
