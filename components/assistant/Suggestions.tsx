"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export default function Suggestions({ suggestions, onSuggestionClick }: SuggestionsProps) {
  if (!suggestions.length) return null;
  
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">您可能想问：</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
} 