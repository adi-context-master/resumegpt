'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { QUICK_PROMPTS } from '@/lib/quickPrompts';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  showQuickPrompts?: boolean;
  onQuickPrompt?: (promptId: string) => void;
  onJobAnalysis?: () => void;
};

const PLACEHOLDERS = [
  "Ask about Aditya's Product experience",
  "Ask about his Banking expertise",
  "Ask about his Skills",
  "Ask about his Education",
  "Ask about RegTech or Cards & Payments",
];

const SUGGESTIONS = [
  { label: 'Experience', description: 'View work history and roles' },
  { label: 'Cards & Payments', description: 'Expertise in payment systems' },
  { label: 'Skills', description: 'Technical and domain skills' },
  { label: 'Education', description: 'Academic background' },
  { label: 'Achievements', description: 'Key accomplishments and impact' },
  { label: 'RegTech Expertise', description: 'Regulatory technology experience' },
  { label: 'Banking', description: 'Digital banking and fintech' },
  { label: 'Product Management', description: 'Product ownership experience' },
];

export default function ChatInput({ onSend, disabled = false, showQuickPrompts = false, onQuickPrompt, onJobAnalysis }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(SUGGESTIONS);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setFade(true);
      }, 300); // Half of transition duration for fade out
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);

    // Filter suggestions based on input
    if (value.trim().length > 0) {
      const filtered = SUGGESTIONS.filter(
        (suggestion) =>
          suggestion.label.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (label: string) => {
    setInput(label);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleQuickPrompt = (promptId: string) => {
    if (onQuickPrompt) {
      onQuickPrompt(promptId);
    }
  };

  return (
    <div className="bg-chat-bg">
      <div className="max-w-3xl mx-auto px-6 py-4">
        {/* Quick Prompts */}
        {showQuickPrompts && (
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleQuickPrompt(prompt.id)}
                className="px-4 py-2 rounded-full bg-user-bubble text-chat-text text-sm hover:bg-chat-accent hover:text-white transition-colors border border-border-light"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <style jsx>{`
            .placeholder-fade::placeholder {
              transition: opacity 0.6s ease-in-out;
              opacity: ${fade ? 1 : 0};
            }
          `}</style>
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            disabled={disabled}
            rows={1}
            className="w-full rounded-2xl px-5 py-4 pr-14 resize-none min-h-[56px] max-h-[200px] text-base placeholder-fade"
          />

          {/* Auto-suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden z-50">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.label)}
                  className="w-full px-5 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {suggestion.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {suggestion.description}
                  </div>
                </button>
              ))}
            </div>
          )}
          {/* Job Analysis Button */}
          {onJobAnalysis && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onJobAnalysis}
                  className="absolute right-14 bottom-3 p-2 rounded-lg hover:bg-chat-accent/10 transition-colors"
                  aria-label="Check Job Fit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-chat-accent">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>Upload Job Description - Check if Aditya is an ideal fit</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            size="icon"
            className="absolute right-3 bottom-3 rounded-lg bg-chat-accent hover:bg-chat-accent/90 text-white"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
