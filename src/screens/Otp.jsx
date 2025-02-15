import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);

  // Get phone details from navigation state
  const { phoneNumber, selectedCountry } = location.state || {};

  useEffect(() => {
    // Redirect back if no phone number
    if (!phoneNumber) {
      navigate('/');
    }
  }, [phoneNumber, navigate]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      // Simulate OTP verification
      // In a real app, you'd call an API here
      console.log('Verifying OTP:', otpCode);
      
      // Navigate to chat screen
      navigate('/chat', {
        state: {
          phoneNumber,
          selectedCountry
        }
      });
    }
  };

  return (
    <div className="relative z-10 space-y-8">
      {/* OTP Verification Header */}
      <div className="text-center">
        <div className="inline-block mb-4 p-3 bg-green-50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Enter Verification Code
        </h1>
        <p className="text-gray-600 text-sm max-w-[300px] mx-auto">
          Enter the 6-digit code sent to {selectedCountry} {phoneNumber}
        </p>
      </div>

      {/* OTP Input Container */}
      <div className="space-y-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => otpInputs.current[index] = el}
              onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl border border-gray-300 
                         rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         transition-all duration-300"
            />
          ))}
        </div>

        {/* Resend Code */}
        <div className="text-center text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button 
            className="text-blue-600 font-medium 
                       hover:text-blue-700 
                       transition-colors duration-300"
          >
            Resend Code
          </button>
        </div>
      </div>

      {/* Verify Button */}
      <button 
        onClick={handleVerifyOtp}
        disabled={otp.some(digit => digit === '')}
        className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider
                   bg-gradient-to-br from-green-600 to-teal-600 text-white 
                   hover:from-green-700 hover:to-teal-700 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition-all duration-300 
                   hover:scale-[1.01] hover:shadow-xl
                   active:scale-[0.99]"
      >
        Verify
      </button>
    </div>
  );
}

export default OtpVerification;