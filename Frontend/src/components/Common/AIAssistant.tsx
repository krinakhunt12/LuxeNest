
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Sparkles } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hello! I'm your LuxeNest Design Assistant. How can I help you style your home today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    const botResponse = await getDesignAdvice(userMsg);
    setIsTyping(false);
    
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[#1F2937] text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">LuxeNest AI Designer</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-[#D4AF37] transition-colors"><X size={20} /></button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-[#1F2937] text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 shadow-sm border border-gray-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about decor tips..."
                className="w-full bg-gray-100 rounded-full py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-2 text-[#D4AF37] hover:text-[#1F2937] transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#1F2937] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#D4AF37] transition-all transform hover:scale-110 group"
        >
          <div className="relative">
            <MessageCircle size={30} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-[#1F2937] group-hover:bg-white"></div>
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
