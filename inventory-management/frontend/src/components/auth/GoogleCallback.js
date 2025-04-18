import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = new URLSearchParams(location.search).get('code');
      
      if (code) {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/google/callback', { code });
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        } catch (error) {
          console.error('Google authentication error:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default GoogleCallback; 