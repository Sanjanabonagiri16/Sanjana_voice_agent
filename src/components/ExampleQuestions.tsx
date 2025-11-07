import React from 'react';
import { Button } from '@/components/ui/button';

interface ExampleQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const questions = [
  "What should we know about your life story in a few sentences?",
  "What's your #1 superpower?",
  "Top 3 areas you'd like to grow in?",
  "What misconception do coworkers have about you?",
  "How do you push your boundaries and limits?",
];

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({ 
  onSelectQuestion, 
  disabled = false 
}) => {
  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
        Example Questions:
      </h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectQuestion(question)}
            disabled={disabled}
            className="text-xs hover:bg-secondary transition-colors"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};
