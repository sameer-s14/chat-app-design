import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  MoonIcon, 
  SunIcon, 
  LanguageIcon, 
  BellIcon 
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function AppSettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'English',
    notifications: true
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full h-screen bg-white">
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <button 
          onClick={handleGoBack}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-3"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">App Settings</h1>
      </header>

      <div className="p-4">
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              {settings.darkMode ? <MoonIcon className="h-6 w-6 mr-3" /> : <SunIcon className="h-6 w-6 mr-3" />}
              <div>
                <h3 className="font-semibold">Dark Mode</h3>
                <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('darkMode')}
              className={`w-12 h-6 rounded-full ${
                settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
              } relative`}
            >
              <span 
                className={`w-6 h-6 bg-white rounded-full absolute top-0 
                            transition-transform ${
                              settings.darkMode 
                                ? 'transform translate-x-6' 
                                : ''
                            }`}
              />
            </button>
          </div>

          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <LanguageIcon className="h-6 w-6 mr-3" />
              <div>
                <h3 className="font-semibold">Language</h3>
                <p className="text-sm text-gray-500">{settings.language}</p>
              </div>
            </div>
            <button className="text-blue-500">Change</button>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <BellIcon className="h-6 w-6 mr-3" />
              <div>
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-gray-500">Receive app notifications</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('notifications')}
              className={`w-12 h-6 rounded-full ${
                settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
              } relative`}
            >
              <span 
                className={`w-6 h-6 bg-white rounded-full absolute top-0 
                            transition-transform ${
                              settings.notifications 
                                ? 'transform translate-x-6' 
                                : ''
                            }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSettingsScreen;