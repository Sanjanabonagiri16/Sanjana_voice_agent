import React, { useState } from 'react';
import { VoiceInterface } from '@/components/VoiceInterface';
import { ExampleQuestions } from '@/components/ExampleQuestions';
import { TextInput } from '@/components/TextInput';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');

  const handleQuestionSelect = (question: string) => {
    setCurrentQuestion(question);
    // Clear after a brief moment to allow the effect to trigger
    setTimeout(() => setCurrentQuestion(''), 100);
  };

  const handleTextSubmit = (text: string) => {
    setCurrentQuestion(text);
    // Clear after a brief moment to allow the effect to trigger
    setTimeout(() => setCurrentQuestion(''), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            100x Voice Agent — Bonagiri Sanjana
          </h1>
          <p className="text-muted-foreground mt-2">
            Tap the mic and ask me interview questions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
          {/* Instructions */}
          <Card className="p-6 w-full bg-card/50 backdrop-blur-sm">
            <h2 className="font-semibold mb-2 text-foreground">How to use:</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tap 🎙️ to speak your question</li>
              <li>• Or type your question below</li>
              <li>• Example questions are listed for quick access</li>
              <li>• Responses will be spoken aloud and displayed as text</li>
            </ul>
          </Card>

          {/* Voice Interface */}
          <VoiceInterface 
            externalQuestion={currentQuestion}
            onProcessingChange={setIsProcessing}
          />

          {/* Text Input */}
          <TextInput 
            onSubmit={handleTextSubmit} 
            disabled={isProcessing}
          />

          {/* Example Questions */}
          <ExampleQuestions 
            onSelectQuestion={handleQuestionSelect}
            disabled={isProcessing}
          />

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border w-full text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                AI Agent Candidate Interview Assistant
              </p>
              <a
                href="mailto:bonagiri.sanjana@example.com?subject=Interview Follow-up"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Bonagiri Sanjana
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
