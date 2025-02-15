import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  CameraIcon 
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function EditProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=4'
  });

  const handleSave = () => {
    // TODO: Implement save logic
    navigate('/settings');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-3"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
        </div>
        <button 
          onClick={handleSave}
          className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"
        >
          <CheckIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-grow flex flex-col items-center py-8 px-4">
        <div className="relative mb-6">
          <img 
            src={profile.avatar} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          <button className="absolute bottom-0 right-0 bg-blue-500 text-white 
                             rounded-full p-2 shadow-lg hover:bg-blue-600">
            <CameraIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full max-w-md">
          {[
            { 
              label: 'Full Name', 
              type: 'text', 
              value: profile.name,
              onChange: (e) => setProfile({...profile, name: e.target.value})
            },
            { 
              label: 'Email', 
              type: 'email', 
              value: profile.email,
              onChange: (e) => setProfile({...profile, email: e.target.value})
            },
            { 
              label: 'Phone Number', 
              type: 'tel', 
              value: profile.phone,
              onChange: (e) => setProfile({...profile, phone: e.target.value})
            }
          ].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.label}
              </label>
              <input 
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                className="w-full py-2 px-3 text-gray-700 
                           bg-white border border-gray-300 rounded 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditProfileScreen;