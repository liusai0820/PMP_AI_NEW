"use client";

import React, { useState, KeyboardEvent } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  
  const handleSendMessage = () => {
    if (input.trim() === '' || disabled) return;
    
    onSendMessage(input);
    setInput('');
  };
  
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="输入您的问题..."
            rows={3}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
          ></textarea>
          <div className="absolute bottom-2 right-2">
            <button
              className={`inline-flex items-center p-2 rounded-full ${
                input.trim() && !disabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSendMessage}
              disabled={!input.trim() || disabled}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">按 Enter 发送，Shift + Enter 换行</p>
      </div>
    </div>
  );
};

export default InputArea; 