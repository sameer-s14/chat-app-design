import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  PaperAirplaneIcon, 
  PhoneIcon, 
  VideoCameraIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';

function MessageScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hey, how are you?',
      sender: 'other',
      timestamp: '2:30 PM'
    },
    {
      id: 2,
      text: 'I\'m good, thanks! How about you?',
      sender: 'me',
      timestamp: '2:31 PM'
    },
    {
      id: 3,
      text: 'Doing great! Want to catch up later?',
      sender: 'other',
      timestamp: '2:32 PM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Get contact details from navigation state
  const { contact } = location.state || { 
    contact: { 
      name: 'Alice Johnson', 
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'Online'
    } 
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages, 
        {
          id: messages.length + 1,
          text: newMessage,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ]);
      setNewMessage('');
    }
  };

  // Go back to chat list
  const handleGoBack = () => {
    navigate('/chat');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleGoBack}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{contact.name}</h3>
              <p className="text-xs text-gray-500">{contact.status}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Messages List */}
      <div className="flex-grow w-full overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[70%] p-3 rounded-xl 
                ${message.sender === 'me' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'}
              `}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="w-full bg-white border-t border-gray-100 p-4 flex items-center space-x-3">
        <input 
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow px-4 py-2 rounded-full 
                     bg-gray-100 border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-300
                     text-sm placeholder-gray-400"
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-full 
                     hover:bg-blue-600 transition-colors"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default MessageScreen;