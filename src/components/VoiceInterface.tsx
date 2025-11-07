import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
            description: "Please try again and speak clearly.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Recognition error",
            description: "Please try again or use text input.",
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
        description: "Speech recognition is not supported in your browser. Please use text input.",
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
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Victoria')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log('Started speaking');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Finished speaking');
      setIsSpeaking(false);
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    };

    // Small delay for better UX
    setTimeout(() => {
      synthRef.current?.speak(utterance);
    }, 300);
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
        return 'bg-listening';
      case 'processing':
        return 'bg-processing';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Microphone Button */}
      <Button
        onClick={toggleMic}
        disabled={micState === 'processing'}
        className={`w-32 h-32 rounded-full ${getMicColor()} hover:opacity-90 transition-all duration-300 shadow-lg ${
          micState === 'listening' ? 'animate-pulse' : ''
        }`}
      >
        {getMicIcon()}
      </Button>

      {/* Status Text */}
      <p className="text-sm text-muted-foreground">
        {micState === 'idle' && 'Tap to speak'}
        {micState === 'listening' && 'Listening...'}
        {micState === 'processing' && 'Processing...'}
      </p>

      {/* Transcript */}
      {transcript && (
        <Card className="p-4 w-full max-w-2xl">
          <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Your Question:</h3>
          <p className="text-foreground">{transcript}</p>
        </Card>
      )}

      {/* Response */}
      {response && (
        <Card className="p-4 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Response:</h3>
            {isSpeaking && (
              <Volume2 className="w-4 h-4 text-accent animate-pulse" />
            )}
          </div>
          <p className="text-foreground whitespace-pre-wrap">{response}</p>
        </Card>
      )}
    </div>
  );
};
