import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function PrivacySecurityScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    profileVisibility: 'everyone',
    lastSeenPrivacy: 'everyone'
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
        <h1 className="text-xl font-bold text-gray-800">Privacy & Security</h1>
      </header>

      <div className="p-4">
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <LockClosedIcon className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <h3 className="font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting('twoFactorAuth')}
              className={`w-12 h-6 rounded-full ${
                settings.twoFactorAuth ? 'bg-blue-500' : 'bg-gray-300'
              } relative`}
            >
              <span 
                className={`w-6 h-6 bg-white rounded-full absolute top-0 
                            transition-transform ${
                              settings.twoFactorAuth 
                                ? 'transform translate-x-6' 
                                : ''
                            }`}
              />
            </button>
          </div>

          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold mb-2">Profile Visibility</h3>
            {['Everyone', 'Contacts', 'Nobody'].map(option => (
              <div 
                key={option} 
                className="flex items-center mb-2"
                onClick={() => setSettings(prev => ({
                  ...prev, 
                  profileVisibility: option.toLowerCase()
                }))}
              >
                <input 
                  type="radio" 
                  name="profileVisibility"
                  checked={settings.profileVisibility === option.toLowerCase()}
                  className="mr-2"
                  readOnly
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacySecurityScreen;