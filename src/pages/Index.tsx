import React, { useState } from 'react';
import { VoiceInterface } from '@/components/VoiceInterface';
import { ExampleQuestions } from '@/components/ExampleQuestions';
import { TextInput } from '@/components/TextInput';
import { GreetingCard } from '@/components/GreetingCard';
import { Card } from '@/components/ui/card';
import { Mail, FileText, ExternalLink } from 'lucide-react';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleQuestionSelect = (question: string) => {
    setCurrentQuestion(question);
    setHasInteracted(true);
    // Clear after a brief moment to allow the effect to trigger
    setTimeout(() => setCurrentQuestion(''), 100);
  };

  const handleTextSubmit = (text: string) => {
    setCurrentQuestion(text);
    setHasInteracted(true);
    // Clear after a brief moment to allow the effect to trigger
    setTimeout(() => setCurrentQuestion(''), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            100x Voice Agent — Bonagiri Sanjana
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            AI Agent Candidate · Tap the mic and ask me interview questions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
          {/* Greeting Card - Show on first load */}
          {!hasInteracted && (
            <GreetingCard />
          )}

          {/* Instructions */}
          <Card className="p-4 md:p-6 w-full bg-card/50 backdrop-blur-sm">
            <h2 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <span>How to use:</span>
            </h2>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Tap 🎙️ to speak your question clearly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Or type your question in the text box below</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Click example questions for quick access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Responses will be spoken aloud with text captions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use Play/Pause controls to manage audio playback</span>
              </li>
            </ul>
          </Card>

          {/* Voice Interface */}
          <div className="w-full">
            <VoiceInterface 
              externalQuestion={currentQuestion}
              onProcessingChange={setIsProcessing}
            />
          </div>

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
          <footer className="mt-12 pt-8 border-t border-border w-full">
            <div className="flex flex-col items-center gap-6">
              <p className="text-sm text-muted-foreground text-center">
                AI Agent Candidate Interview Assistant · Built with Lovable
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:bonagiri.sanjana@example.com?subject=Interview Follow-up&body=Hi Bonagiri,%0D%0A%0D%0AI just completed the voice interview and would like to discuss next steps.%0D%0A%0D%0AThank you!"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                  aria-label="Email Bonagiri Sanjana"
                >
                  <Mail className="w-4 h-4" />
                  Email for Follow-up
                </a>
                
                <span className="text-muted-foreground">·</span>
                
                <a
                  href="https://example.com/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                  aria-label="View resume"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <span className="text-muted-foreground">·</span>
                
                <a
                  href="https://example.com/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                  aria-label="View portfolio"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </a>
              </div>

              <p className="text-xs text-muted-foreground text-center max-w-md">
                This voice agent demonstrates AI-powered interview assistance with natural language processing and text-to-speech capabilities.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
