import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioControls } from './AudioControls';
import { ListeningIndicator } from './ListeningIndicator';

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
    
    utterance.rate = 0.95; // Medium pace
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
          className={`w-32 h-32 rounded-full ${getMicColor()} transition-all duration-300 shadow-lg hover:shadow-xl ${
            micState === 'listening' ? 'animate-pulse scale-105' : ''
          }`}
          aria-label={micState === 'idle' ? 'Start listening' : micState === 'listening' ? 'Stop listening' : 'Processing'}
        >
          {getMicIcon()}
        </Button>
        
        {/* Listening Indicator */}
        {micState === 'listening' && (
          <div className="absolute -bottom-8">
            <ListeningIndicator />
          </div>
        )}
      </div>

      {/* Status Text */}
      <p className="text-sm font-medium text-muted-foreground">
        {micState === 'idle' && 'Tap to speak'}
        {micState === 'listening' && 'Listening...'}
        {micState === 'processing' && 'Processing your question...'}
      </p>

      {/* Transcript */}
      {transcript && (
        <Card className="p-4 w-full max-w-2xl animate-fade-in border-primary/20">
          <h3 className="font-semibold mb-2 text-sm text-muted-foreground flex items-center gap-2">
            <span>Your Question:</span>
          </h3>
          <p className="text-foreground leading-relaxed">{transcript}</p>
        </Card>
      )}

      {/* Response */}
      {response && (
        <Card className="p-4 w-full max-w-2xl animate-fade-in border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
              Response from Bonagiri:
              {isSpeaking && (
                <Volume2 className="w-4 h-4 text-accent animate-pulse" />
              )}
            </h3>
          </div>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed mb-4">{response}</p>
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
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
        </Card>
      )}
    </div>
  );
};
