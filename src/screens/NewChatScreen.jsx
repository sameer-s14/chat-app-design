import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  MagnifyingGlassIcon, 
  UserIcon 
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Mock contacts - replace with actual contact list from backend
const MOCK_CONTACTS = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Online'
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Offline'
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'Away'
  }
];

function NewChatScreen() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Go back to chat screen
  const handleGoBack = () => {
    navigate('/chat');
  };

  // Start a new chat with selected contact
  const startChat = (contact) => {
    console.log('>>>>>>>>>>>>>>>>>>>>')
    navigate(`/chat/${contact.id}`, { 
      state: { 
        contact: contact 
      } 
    });
  };
  

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <button 
          onClick={handleGoBack}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-3"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">New Chat</h1>
      </header>

      {/* Search Bar */}
      <div className="w-full px-4 py-3 bg-gray-50">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search contacts"
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

      {/* Contact List */}
      <div className="flex-grow w-full overflow-y-auto">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id} 
            onClick={() => startChat(contact)}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 
                       border-b border-gray-100 last:border-b-0 
                       cursor-pointer active:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div className="relative mr-4">
              <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            {/* Contact Details */}
            <div className="flex-grow overflow-hidden">
              <h3 className="font-semibold text-gray-800 truncate">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-500">
                {contact.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewChatScreen;