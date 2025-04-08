// src/components/VerifyOTP.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('tempEmail');

  useEffect(() => {
    if (!storedEmail) {
      navigate('/register'); // Redirect to register if no email is stored
    }
  }, [navigate, storedEmail]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) { // Allow only one digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/verify-otp', {
        email: storedEmail,
        otp: otpString,
      });

      console.log(response.data);
      console.log(response.status);
      
      

      if (response.status==200) {
        localStorage.removeItem('tempEmail');
        navigate('/login');
      }
    } catch (error) {
      setError(error.response.data.otp[0]);
      console.error('OTP verification error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-4">Enter the 6-digit OTP sent to {storedEmail}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                autoFocus={index === 0}
                disabled={!storedEmail}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={!storedEmail}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;