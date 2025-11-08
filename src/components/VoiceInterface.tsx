import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioControls } from './AudioControls';
import { ListeningIndicator } from './ListeningIndicator';
import { SpeedControl } from './SpeedControl';

type MicState = 'idle' | 'listening' | 'processing';

interface VoiceInterfaceProps {
  externalQuestion?: string;
  onProcessingChange?: (processing: boolean) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  externalQuestion,
  onProcessingChange 
}) => {
  const [micState, setMicState] = useState<MicState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Handle external questions from text input or example questions
  useEffect(() => {
    if (externalQuestion) {
      setTranscript(externalQuestion);
      handleQuestion(externalQuestion);
    }
  }, [externalQuestion]);

  // Notify parent about processing state
  useEffect(() => {
    onProcessingChange?.(micState === 'processing');
  }, [micState, onProcessingChange]);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        console.log('Speech recognized:', speechResult);
        setTranscript(speechResult);
        handleQuestion(speechResult);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setMicState('idle');
        
        if (event.error === 'no-speech') {
          toast({
            title: "No speech detected",
            description: "Sorry — I couldn't hear that. Please type your question or try again.",
            variant: "destructive",
          });
        } else if (event.error === 'not-allowed') {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Recognition error",
            description: "Sorry — I couldn't hear that. Please type your question or try again.",
            variant: "destructive",
          });
        }
      };

      recognitionRef.current.onend = () => {
        if (micState === 'listening') {
          setMicState('idle');
        }
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser. Please use text input instead.",
        variant: "destructive",
      });
      return;
    }

    setMicState('listening');
    setTranscript('');
    setResponse('');
    
    try {
      recognitionRef.current.start();
      console.log('Started listening...');
    } catch (error) {
      console.error('Error starting recognition:', error);
      setMicState('idle');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setMicState('idle');
  };

  const handleQuestion = async (question: string) => {
    setMicState('processing');
    
    try {
      console.log('Sending question to backend:', question);
      
      const { data, error } = await supabase.functions.invoke('chat-interview', {
        body: { question }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const answer = data?.answer;
      if (!answer) {
        throw new Error('No response received');
      }

      console.log('Received answer:', answer);
      setResponse(answer);
      speakResponse(answer);
      
    } catch (error: any) {
      console.error('Error processing question:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setResponse("I'm sorry, I encountered an error. Please try asking your question again.");
    } finally {
      setMicState('idle');
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to use a natural female voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Samantha') ||
      voice.name.includes('Aria') ||
      voice.name.includes('Ava') ||
      voice.name.includes('Female') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Victoria')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = speechRate; // Use selected speed
    utterance.pitch = 1.0; // Default/medium pitch
    utterance.volume = 1.0; // Default volume

    utterance.onstart = () => {
      console.log('Started speaking');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Finished speaking');
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);

    // Small delay (300ms) for better UX
    setTimeout(() => {
      synthRef.current?.speak(utterance);
    }, 300);
  };

  const togglePlayPause = () => {
    if (!synthRef.current || !response) return;

    if (isSpeaking) {
      synthRef.current.pause();
      setIsSpeaking(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsSpeaking(true);
      } else {
        speakResponse(response);
      }
    }
  };

  const replayAudio = () => {
    if (response) {
      speakResponse(response);
    }
  };

  const summarizeResponse = () => {
    if (!response) return;
    
    const sentences = response.split(/[.!?]+/).filter(s => s.trim());
    const summary = sentences[0]?.trim() + '.';
    
    toast({
      title: "Summary",
      description: summary,
      duration: 5000,
    });
  };

  const handleSpeedChange = (speed: number) => {
    setSpeechRate(speed);
    
    // If currently speaking, restart with new speed
    if (isSpeaking && response) {
      synthRef.current?.cancel();
      speakResponse(response);
    }
    
    toast({
      title: "Speed Updated",
      description: `Voice speed set to ${speed === 0.75 ? 'slower' : speed === 1.0 ? 'normal' : 'faster'}`,
      duration: 2000,
    });
  };

  const toggleMic = () => {
    if (micState === 'idle') {
      startListening();
    } else if (micState === 'listening') {
      stopListening();
    }
  };

  const getMicIcon = () => {
    switch (micState) {
      case 'listening':
        return <Mic className="w-12 h-12" />;
      case 'processing':
        return <Loader2 className="w-12 h-12 animate-spin" />;
      default:
        return <MicOff className="w-12 h-12" />;
    }
  };

  const getMicColor = () => {
    switch (micState) {
      case 'listening':
        return 'bg-listening hover:bg-listening/90';
      case 'processing':
        return 'bg-processing hover:bg-processing/90';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Microphone Button */}
      <div className="relative flex flex-col items-center gap-4">
        <Button
          onClick={toggleMic}
          disabled={micState === 'processing'}
          className={`w-36 h-36 rounded-full ${getMicColor()} transition-all duration-300 shadow-2xl hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${
            micState === 'listening' ? 'animate-pulse scale-110' : 'hover:scale-105'
          } relative overflow-hidden`}
          aria-label={micState === 'idle' ? 'Start listening' : micState === 'listening' ? 'Stop listening' : 'Processing'}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            {getMicIcon()}
          </div>
        </Button>
        
        {/* Listening Indicator */}
        {micState === 'listening' && (
          <div className="absolute -bottom-8">
            <ListeningIndicator />
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">
          {micState === 'idle' && 'Ready to listen'}
          {micState === 'listening' && 'I\'m listening...'}
          {micState === 'processing' && 'Processing your question'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {micState === 'idle' && 'Tap the microphone or use text input below'}
          {micState === 'listening' && 'Speak clearly into your device'}
          {micState === 'processing' && 'Generating response...'}
        </p>
      </div>

      {/* Transcript */}
      {transcript && (
        <Card className="p-6 w-full max-w-2xl animate-fade-in border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-lg">
          <h3 className="font-bold mb-3 text-sm text-primary flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xs">💬</span>
            </div>
            <span>Your Question</span>
          </h3>
          <p className="text-foreground leading-relaxed font-medium">{transcript}</p>
        </Card>
      )}

      {/* Response */}
      {response && (
        <Card className="p-6 w-full max-w-2xl animate-fade-in border-accent/30 bg-gradient-to-br from-accent/5 to-transparent shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-accent flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-xs">🤖</span>
              </div>
              <span>Response from Bonagiri</span>
              {isSpeaking && (
                <Volume2 className="w-4 h-4 text-accent animate-pulse" />
              )}
            </h3>
          </div>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed mb-4 text-[15px]">{response}</p>
          
          <div className="flex flex-col gap-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <AudioControls
                isPlaying={isSpeaking}
                onPlayPause={togglePlayPause}
                onReplay={replayAudio}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={summarizeResponse}
                className="text-xs"
              >
                Summarize in one sentence
              </Button>
            </div>
            <SpeedControl
              currentSpeed={speechRate}
              onSpeedChange={handleSpeedChange}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
