'use client';

import { useState, useRef, useEffect } from 'react';

// Type for a message
type Message = {
  role: 'user' | 'bot';
  content: string; 
};

// Type for a chat item in the sidebar
type ChatItem = {
  id: number;
  title: string;
  isSelected: boolean;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarItems, setSidebarItems] = useState<ChatItem[]>([

    { id: 3, title: 'Library', isSelected: false },
    { id: 4, title: 'Sora', isSelected: false },
    { id: 5, title: 'GPTs', isSelected: false },
    { id: 6, title: 'Create ChatGPT UI', isSelected: false },
    { id: 7, title: 'Duplicate value detection', isSelected: false },
    { id: 8, title: 'Drone range safety tips', isSelected: false },
    { id: 9, title: 'Dot product example', isSelected: false },
    { id: 10, title: 'ESP32 S3 vs Mini', isSelected: false },
    { id: 11, title: 'AIO code for Chandauli', isSelected: false },
    { id: 12, title: 'PCB fabrication cost India', isSelected: false },
    { id: 13, title: 'Why return from hash_set', isSelected: false },
    { id: 14, title: 'Who painted gods in India', isSelected: false },
    { id: 15, title: 'Reference', isSelected: false }, // ✅ New sidebar item
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = { role: 'bot', content: `Echo: ${input}` };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSidebarClick = (id: number) => {
    setSidebarItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, isSelected: true }
          : { ...item, isSelected: false }
      )
    );
  };

  return (
    <div className="flex h-screen bg-[#343541]">
      
      <div
      className={`fixed z-30 top-0 left-0 h-full w-64 bg-[#202123] p-3 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
      showSidebar ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:block`}
      >
        
        <button className="w-full text-left text-white px-3 py-2 rounded-md hover:bg-gray-700 mb-4 border border-gray-500 flex items-center gap-2">
          <span>➕</span> New chat
        </button>
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id} className="text-gray-300">
              <button
                onClick={() => handleSidebarClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 ${
                  item.isSelected ? 'bg-gray-700 text-white' : ''
                }`}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showSidebar && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        onClick={() => setShowSidebar(false)}
      />
      )}


      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#202123] text-white p-3 flex items-center justify-between shadow-md md:hidden">
          <button className="text-white" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>
          <h1 className="text-lg font-bold">ChatGPT</h1>
          <span></span>
        </div>

        {/* Message display */}
        <div className="flex-1 overflow-y-auto p-4 text-white">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-semibold mb-8 text-white">What are you working on?</h2>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-[#343541] md:bg-transparent">
          <div className="relative max-w-2xl mx-auto flex items-center bg-[#40414F] rounded-lg shadow-xl">
            <input
              type="text"
              className="w-full pl-4 pr-16 py-3 text-white bg-transparent outline-none placeholder-gray-400"
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-4 text-gray-400 hover:text-white"
              onClick={sendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
