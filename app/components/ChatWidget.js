'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hey! 🔥 I'm MoltFire. This chat widget is a preview - for now, use Telegram to talk to me directly. But I can still help with quick things here!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate response (in real implementation, this would call an API)
    setTimeout(() => {
      const responses = [
        "I hear you! For complex tasks, message me on Telegram - I have full access to all your tools there. 📱",
        "Got it! Quick tip: Use the dashboard buttons to run workflows, or hit me up on Telegram for real conversations. 🔥",
        "I'm processing that... For now, my full capabilities are in Telegram. This widget is a preview of what's coming! 🚀",
        "Nice! The dashboard shows your data, but for actual assistance, Telegram is where the magic happens. 💬",
      ];
      
      const response = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString()
      };

      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: '📊 Status', action: 'What\'s my current status?' },
    { label: '⚡ Tokens', action: 'How are my tokens looking?' },
    { label: '📅 Follow-ups', action: 'Any follow-ups due?' },
    { label: '🎯 Goals', action: 'How are my goals progressing?' },
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50 ${
          isOpen 
            ? 'bg-gray-700 rotate-45' 
            : 'fire-gradient glow-orange hover:scale-110'
        }`}
      >
        <span className="text-2xl">{isOpen ? '✕' : '🔥'}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] glass-card rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="fire-gradient p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <div className="font-bold text-white">MoltFire</div>
              <div className="text-xs text-white text-opacity-80">Your AI Assistant</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                      : 'glass-card text-white rounded-bl-md'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass-card p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(qa.action);
                    handleSend();
                  }}
                  className="text-xs px-2 py-1 glass-card rounded-full hover:bg-opacity-30 transition-all"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 fire-gradient rounded-full flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                <span>➤</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              💡 For full AI capabilities, use Telegram
            </div>
          </div>
        </div>
      )}
    </>
  );
}
