import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PhoneVerification from './screens/PhoneVerification';
import OtpVerification from './screens/Otp';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/ProfileScreen';
import PrivacySecurityScreen from './screens/PrivacySecurityScreen';
import AppSettingsScreen from './screens/AppSettingsScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import NewGroupChatScreen from './screens/NewGroupChatScreen';
import NewChatScreen from './screens/NewChatScreen';
import MessageScreen from './screens/MessageScreen';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white md:border md:border-gray-200 md:shadow-lg md:rounded-xl overflow-hidden">
        <div className="max-w-md mx-auto px-6 py-12 space-y-8 relative">
          {/* Floating Accent Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-100 rounded-full translate-x-1/2 translate-y-1/2 opacity-50 blur-2xl"></div>

          <Routes>
            <Route path="/" element={<PhoneVerification />} />
            <Route path="/otp" element={<OtpVerification />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/profile/edit" element={<EditProfileScreen />} />
            <Route path="/privacy" element={<PrivacySecurityScreen />} />
            <Route path="/app-settings" element={<AppSettingsScreen />} />
            <Route path="/help" element={<HelpSupportScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/new-group" element={<NewGroupChatScreen />} />
            <Route path="/new-chat" element={<NewChatScreen />} />
            <Route path="/chat/:contactId" element={<MessageScreen />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;