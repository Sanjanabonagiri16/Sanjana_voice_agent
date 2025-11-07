import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onSubmit, disabled = false }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl flex gap-2">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Or type your question here..."
        disabled={disabled}
        className="resize-none"
        rows={2}
      />
      <Button 
        onClick={handleSubmit} 
        disabled={disabled || !inputText.trim()}
        size="icon"
        className="shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};
