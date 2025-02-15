import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PhoneVerification() {
  const [selectedCountry, setSelectedCountry] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const countries = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleSubmitPhone = () => {
    // You can add phone number validation here
    navigate('/otp', { 
      state: { 
        phoneNumber, 
        selectedCountry 
      } 
    });
  };

  return (
    <div className="relative z-10 space-y-8">
      {/* Innovative Header */}
      <div className="text-center">
        <div className="inline-block mb-4 p-3 bg-blue-50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Verify Your Phone
        </h1>
        <p className="text-gray-600 text-sm max-w-[300px] mx-auto">
          Secure your account with a quick verification
        </p>
      </div>

      {/* Input Container with Advanced Styling */}
      <div className="space-y-6">
        {/* Country Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <div className="relative">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl 
                         appearance-none bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition-all duration-300 
                         hover:border-blue-300"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex space-x-3">
            <input 
              type="text" 
              value={selectedCountry}
              readOnly 
              className="w-1/4 px-3 py-3.5 border border-gray-200 rounded-xl 
                         bg-gray-50 text-center font-semibold text-gray-800"
            />
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={handlePhoneChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter phone number"
              maxLength="10"
              className={`flex-grow px-4 py-3.5 border rounded-xl 
                         ${focused 
                           ? 'border-blue-500 ring-2 ring-blue-100' 
                           : 'border-gray-200'}
                         transition-all duration-300
                         text-gray-900 placeholder-gray-400`}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmitPhone}
        disabled={phoneNumber.length < 10}
        className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider
                   bg-gradient-to-br from-blue-600 to-purple-600 text-white 
                   hover:from-blue-700 hover:to-purple-700 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition-all duration-300 
                   hover:scale-[1.01] hover:shadow-xl
                   active:scale-[0.99]"
      >
        Continue
      </button>

      {/* Terms */}
      <div className="text-center text-xs text-gray-500">
        By tapping Continue, you agree to the{' '}
        <a 
          href="#" 
          className="text-blue-600 font-medium 
                     hover:text-blue-700 
                     transition-colors duration-300 
                     hover:underline"
        >
          Terms of Service
        </a>
      </div>
    </div>
  );
}

export default PhoneVerification;