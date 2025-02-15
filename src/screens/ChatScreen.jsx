import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserGroupIcon,
  UserIcon,
  CogIcon,
  PlusIcon
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Mock data - will be replaced with actual data source
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey, how are you doing?',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Meeting at 4 PM',
    lastMessageTime: '1:45 PM',
    unreadCount: 1,
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Sounds good!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  }
];


function ChatScreen() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a function to navigate to profile
  const goToProfile = () => {
    navigate('/profile/edit');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  const startNewChat = () => {
    navigate('/new-chat');
  };

  // Start a new group chat
  const startGroupChat = () => {
    navigate('/new-group');
  };
  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Chats</h1>
        </div>
        <div className="flex items-center space-x-3">
        <button
          onClick={startNewChat}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          aria-label="New Chat"
        >
          <PlusIcon className="h-5 w-5" />
        </button>

        <button
          onClick={startGroupChat}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          aria-label="New Group Chat"
        >
          <UserGroupIcon className="h-5 w-5" />
        </button>
          <button
            onClick={goToProfile}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          >
            <UserIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <UserGroupIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="w-full px-4 py-3 bg-gray-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full 
                       bg-white border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-300
                       text-sm placeholder-gray-400"
          />
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 
                       h-5 w-5 text-gray-400"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-grow w-full overflow-y-auto">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => navigate(`/chat/${conversation.id}`, { 
              state: { 
                contact: conversation 
              } 
            })}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 
                       border-b border-gray-100 last:border-b-0 
                       cursor-pointer active:bg-gray-100 transition-colors"
          >
            {/* Avatar with online status */}
            <div className="relative mr-4">
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 
                               h-3 w-3 bg-green-500 
                               rounded-full border-2 border-white"></span>
            </div>

            {/* Conversation Details */}
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate max-w-[70%]">
                  {conversation.name}
                </h3>
                <span className="text-xs text-gray-500 pl-2">
                  {conversation.lastMessageTime}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500 truncate flex-grow pr-2">
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white 
                                   rounded-full px-2 py-0.5 
                                   text-xs min-w-[20px] text-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="w-full bg-white border-t border-gray-100 flex justify-around py-3">
        <button className="text-blue-600 flex flex-col items-center">
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Chats</span>
        </button>
        
        <button className="text-gray-500 flex flex-col items-center">
          <PhoneIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Calls</span>
        </button>
        <button
          onClick={goToSettings}
          className="text-gray-500 flex flex-col items-center"
        >
          <CogIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default ChatScreen;