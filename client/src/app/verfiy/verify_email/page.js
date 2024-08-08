'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "../verify_email/page.css";

const EmailVerification = () => {
    const router = useRouter();
    const [message, setMessage] = useState('Verifying email .......');
    const [isLoading, setIsLoading] = useState(true);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [token, setToken] = useState(''); // Add this line to create the token state variable

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tokenFromURL = searchParams.get('token');
        if (tokenFromURL) {
            setToken(tokenFromURL);
            handleVerification(tokenFromURL);
        } else {
            setMessage('No token provided.');
            setIsLoading(false);
        }
    }, []);

    const handleVerification = async (token) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/verify-email`, { params: { token } });
            const responseMessage = response.data.msg;
            setMessage(responseMessage);

            // Show continue button only if the response indicates mobile number verification is needed
            if (responseMessage.includes('Please verify your mobile number')) {
                setShowContinueButton(true);
            } else {
                setShowContinueButton(false);
            }
        } catch (error) {
            console.error('Verification error:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.msg || 'Email verification failed.');
            } else {
                setMessage('Email verification failed. Invalid or expired link.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        router.push(`/otp_verify?token=${token}`);
    };

    return (
        <div className='verification'>
            <div className="status">
                <h1>{isLoading ? 'Verifying...' : message}</h1>
                {!isLoading && showContinueButton && (
                    <h3>
                        For OTP verification, click on continue 
                        <button 
                            className='continue_btn' 
                            onClick={handleContinue}
                        > 
                            Continue 
                        </button>
                    </h3>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
