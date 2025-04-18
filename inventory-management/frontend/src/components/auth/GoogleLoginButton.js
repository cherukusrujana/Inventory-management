import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../utils/axios';
import { authConfig } from '../../config/auth';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      // Check if Google Identity Services is loaded
      if (typeof window.google === 'undefined') {
        throw new Error('Google Identity Services not loaded');
      }

      // Initialize the Google OAuth client
      window.google.accounts.id.initialize({
        client_id: authConfig.google.clientId,
        callback: async (response) => {
          try {
            // Send the credential (ID token) to your backend
            const backendResponse = await axios.post('/auth/google', {
              tokenId: response.credential
            });

            if (backendResponse.data.token) {
              localStorage.setItem('token', backendResponse.data.token);
              onSuccess(backendResponse.data);
              navigate('/');
            }
          } catch (error) {
            if (error.response?.status === 401 && error.response?.data?.email) {
              // User needs to register first
              const { email, name } = error.response.data;
              navigate('/register', { 
                state: { 
                  email, 
                  name,
                  message: 'Please complete your registration to use Google login'
                } 
              });
            } else {
              console.error('Google login error:', error);
              onError(error);
            }
          }
        }
      });

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'center'
        }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      onError(error);
    }
  };

  return (
    <div ref={buttonRef} className="w-100"></div>
  );
};

export default GoogleLoginButton; 