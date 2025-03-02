"use client";

import React from 'react';

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions.length) return null;
  
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <h3 className="text-xs font-medium text-gray-500 mb-2">您可能想问：</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions; 