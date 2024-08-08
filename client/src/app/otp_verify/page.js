'use client';
import React, { useState } from 'react';
import "../otp_verify/page.css";
import axios from 'axios';

const OtpInput = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Auto-focus on next input field
    if (value.length === 1 && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // Auto-focus on previous input field
    if (value.length === 0 && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    console.log('Submitting OTP:', otpString);

    try {
      const response = await axios.post('http://localhost:8001/api/verify-otp', {
        otp: otpString,
      });

      const result = response.data;

      if (result.msg) {
        alert(result.msg);
      } else {
        alert('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred while verifying OTP. Please try again.');
    }
  };

  return (
    <div className='check_validation'>
      <h3 className='heading'>Check your phone for OTP</h3>
      <form className="form" onSubmit={handleSubmit}>
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={value}
            onChange={(e) => handleChange(e, index)}
            maxLength="1"
            placeholder={`${index + 1} digit`}
          />
        ))}
        <button type='submit' className='submit'>Submit</button>
      </form>
    </div>
  );
};

export default OtpInput;
