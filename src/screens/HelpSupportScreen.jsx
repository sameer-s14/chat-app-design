import React from 'react';
import { 
  ArrowLeftIcon, 
  QuestionMarkCircleIcon, 
  ChatBubbleLeftRightIcon,  
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function HelpSupportScreen() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const helpOptions = [
    {
      icon: <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500" />,
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />,
      title: 'Chat Support',
      subtitle: 'Talk to our support team'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500" />,
      title: 'Email Support',
      subtitle: 'support@chatapp.com'
    }
  ];

  return (
    <div className="w-full h-screen bg-white">
      <header className="w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <button 
          onClick={handleGoBack}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-3"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Help & Support</h1>
      </header>

      <div className="p-4">
        {helpOptions.map((option, index) => (
          <div 
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100"
          >
            {option.icon}
            <div className="ml-4">
              <h3 className="font-semibold">{option.title}</h3>
              <p className="text-sm text-gray-500">{option.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpSupportScreen;