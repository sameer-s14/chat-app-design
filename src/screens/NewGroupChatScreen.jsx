import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  CheckIcon
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Mock contacts - replace with actual contact list from backend
const MOCK_CONTACTS = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    selected: false
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    selected: false
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=3',
    selected: false
  }
];

function NewGroupChatScreen() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupName, setGroupName] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle contact selection
  const toggleContactSelection = (contactId) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, selected: !contact.selected }
        : contact
    ));
  };

  // Go back to chat screen
  const handleGoBack = () => {
    navigate('/chat');
  };

  // Create group chat
  const createGroupChat = () => {
    const selectedContacts = contacts.filter(contact => contact.selected);
    if (selectedContacts.length > 0 && groupName.trim()) {
      navigate('/chat/group', { 
        state: { 
          contacts: selectedContacts,
          groupName: groupName
        } 
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-3"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">New Group</h1>
        </div>
        {contacts.some(contact => contact.selected) && (
          <button 
            onClick={createGroupChat}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"
          >
            <CheckIcon className="h-6 w-6" />
          </button>
        )}
      </header>

      {/* Group Name Input */}
      <div className="w-full px-4 py-3 bg-gray-50">
        <input 
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 rounded-full 
                     bg-white border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-300
                     text-sm placeholder-gray-400"
        />
      </div>

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
            onClick={() => toggleContactSelection(contact.id)}
            className={`w-full flex items-center px-4 py-3 
                       border-b border-gray-100 last:border-b-0 
                       cursor-pointer transition-colors
                       ${contact.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            {/* Avatar */}
            <div className="relative mr-4">
              <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              {contact.selected && (
                <span className="absolute bottom-0 right-0 
                                 h-5 w-5 bg-blue-500 
                                 rounded-full flex items-center justify-center
                                 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
              )}
            </div>

            {/* Contact Details */}
            <div className="flex-grow overflow-hidden">
              <h3 className="font-semibold text-gray-800 truncate">
                {contact.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewGroupChatScreen;