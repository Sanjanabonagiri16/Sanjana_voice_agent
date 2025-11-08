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
      <header className="border-b border-border bg-gradient-to-r from-card/90 via-primary/5 to-card/90 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl animate-pulse">
              🤖
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                100x Voice Agent — Bonagiri Sanjana
              </h1>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                Python Developer · Full Stack Engineer · AI/ML Specialist
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">2+ Years Experience</span>
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">70+ Projects</span>
            <span className="text-xs bg-secondary/30 text-foreground px-2 py-1 rounded-full font-medium">10 SaaS Products</span>
          </div>
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
          <Card className="p-4 md:p-6 w-full bg-gradient-to-br from-card/60 via-primary/5 to-card/60 backdrop-blur-sm border-primary/20 shadow-lg">
            <h2 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span>How to use this Voice Agent:</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-background/50 p-3 rounded-lg">
                <span className="text-2xl">🎙️</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Voice Input</p>
                  <p className="text-xs text-muted-foreground">Tap the microphone to speak your question clearly</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background/50 p-3 rounded-lg">
                <span className="text-2xl">⌨️</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Text Input</p>
                  <p className="text-xs text-muted-foreground">Type your question in the text box below</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background/50 p-3 rounded-lg">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Quick Questions</p>
                  <p className="text-xs text-muted-foreground">Click example questions organized by category</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background/50 p-3 rounded-lg">
                <span className="text-2xl">🔊</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Audio Playback</p>
                  <p className="text-xs text-muted-foreground">Responses spoken aloud with text captions and controls</p>
                </div>
              </div>
            </div>
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
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground mb-1">
                  💼 Bonagiri Sanjana — AI Agent Candidate for 100x
                </p>
                <p className="text-xs text-muted-foreground">
                  Python · Full Stack · AI/ML · AWS · Azure · Vercel
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:bonagiri.sanjana@example.com?subject=100x AI Agent Interview Follow-up&body=Hi Bonagiri,%0D%0A%0D%0AI just completed the voice interview and would like to discuss next steps for the AI Agent position at 100x.%0D%0A%0D%0AThank you!"
                  className="inline-flex items-center gap-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full transition-all hover:scale-105"
                  aria-label="Email Bonagiri Sanjana"
                >
                  <Mail className="w-4 h-4" />
                  Email for Follow-up
                </a>
                
                <a
                  href="https://example.com/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-full transition-all hover:scale-105"
                  aria-label="View resume"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <a
                  href="https://example.com/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-secondary/30 hover:bg-secondary/40 text-foreground px-4 py-2 rounded-full transition-all hover:scale-105"
                  aria-label="View portfolio"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </a>
              </div>

              <div className="bg-card/50 border border-border rounded-lg p-4 max-w-2xl">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-semibold text-foreground">About this Voice Agent:</span> This AI-powered interview assistant demonstrates natural language processing, text-to-speech synthesis, and conversational AI capabilities. Built to showcase technical expertise and communication skills for the 100x AI Agent role.
                </p>
              </div>

              <p className="text-xs text-muted-foreground/60 text-center">
                © 2025 Bonagiri Sanjana · All Rights Reserved
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
