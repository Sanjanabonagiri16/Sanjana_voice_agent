import React from 'react';
import { Button } from '@/components/ui/button';

interface ExampleQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const questionCategories = [
  {
    category: "Personal & Background",
    icon: "🧍‍♀️",
    questions: [
      "What should we know about your life story in a few sentences?",
      "How did you get interested in AI and software development?",
      "What's the project you're most proud of and why?",
      "How do you balance creativity and technical precision in your work?",
      "What motivates you to keep learning and building?",
    ]
  },
  {
    category: "Skills & Technical Growth",
    icon: "⚙️",
    questions: [
      "What's your #1 superpower as a developer?",
      "What are the top 3 areas you'd like to grow in?",
      "How do you approach learning a new tool or framework?",
      "How have you used AI tools like Cursor, Lovable, or Warp in real projects?",
      "Can you explain a challenge you solved using Python or machine learning?",
    ]
  },
  {
    category: "Teamwork & Mindset",
    icon: "💡",
    questions: [
      "What misconception do coworkers or peers have about you?",
      "How do you handle feedback or disagreements on a project?",
      "How do you push your boundaries and limits when working alone?",
      "Describe a moment when you had to take initiative without being asked.",
      "How do you stay motivated during long development cycles?",
    ]
  },
  {
    category: "Innovation & Future Vision",
    icon: "🚀",
    questions: [
      "What does innovation mean to you in the AI space?",
      "What kind of AI products or agents do you dream of building?",
      "If given complete freedom, what problem would you solve using AI?",
      "How do you see the future of SaaS and automation evolving?",
      "Why do you think you'd be a great fit for 100x's AI Agent Team?",
    ]
  }
];

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({ 
  onSelectQuestion, 
  disabled = false 
}) => {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
        <span>💬</span>
        <span>Example Interview Questions</span>
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {questionCategories.map((category, categoryIndex) => (
          <div 
            key={categoryIndex}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
              className="w-full text-left mb-3 flex items-center justify-between"
            >
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.category}</span>
              </h4>
              <span className="text-muted-foreground text-xs">
                {expandedCategory === category.category ? '▼' : '▶'}
              </span>
            </button>
            <div className={`flex flex-col gap-2 transition-all duration-300 ${
              expandedCategory === category.category ? 'block' : 'hidden'
            }`}>
              {category.questions.map((question, qIndex) => (
                <Button
                  key={qIndex}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectQuestion(question)}
                  disabled={disabled}
                  className="text-xs text-left justify-start hover:bg-accent/50 transition-colors h-auto py-2 px-3 whitespace-normal"
                >
                  <span className="text-primary mr-2">•</span>
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
