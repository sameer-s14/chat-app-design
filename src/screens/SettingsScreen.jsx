import React from 'react';
import { 
  UserIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  QuestionMarkCircleIcon, 
  ArrowRightOnRectangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function SettingsScreen() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <UserIcon className="h-6 w-6 text-blue-500" />,
      title: 'Edit Profile',
      subtitle: 'Change your profile details',
      action: () => navigate('/profile/edit')
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6 text-green-500" />,
      title: 'Privacy & Security',
      subtitle: 'Manage your account security',
      action: () => navigate('/privacy')
    },
    {
      icon: <CogIcon className="h-6 w-6 text-gray-500" />,
      title: 'App Settings',
      subtitle: 'Customize your app experience',
      action: () => navigate('/app-settings')
    },
    {
      icon: <QuestionMarkCircleIcon className="h-6 w-6 text-purple-500" />,
      title: 'Help & Support',
      subtitle: 'Get assistance and information',
      action: () => navigate('/help')
    }
  ];

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('authToken');
    // Redirect to login
    navigate('/');
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-4 py-4 flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
      </header>

      {/* User Profile Summary */}
      <div className="px-4 py-6 border-b border-gray-100 flex items-center">
        <img 
          src="https://i.pravatar.cc/150?img=4" 
          alt="Profile" 
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">John Doe</h2>
          <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="flex-grow">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            onClick={item.action}
            className="w-full flex items-center justify-between px-4 py-4 
                       hover:bg-gray-50 border-b border-gray-100 text-left"
          >
            <div className="flex items-center">
              {item.icon}
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center 
                     bg-red-50 text-red-600 py-3 rounded-lg
                     hover:bg-red-100 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default SettingsScreen;