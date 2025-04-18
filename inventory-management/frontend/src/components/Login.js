import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    script.onerror = () => {
      setError('Failed to load Google Sign-In. Please try again later.');
      setGoogleLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with'
        }
      );

      setGoogleLoading(false);
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setError('Failed to initialize Google Sign-In. Please try again later.');
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = async (response) => {
    try {
      setLoading(true);
      setError('');

      const result = await axios.post('http://localhost:5000/api/auth/google', {
        credential: response.credential
      });

      localStorage.setItem('token', result.data.token);
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.response?.data?.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', result.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="border-light shadow-sm">
            <Card.Header className="bg-white border-light py-4">
              <h2 className="mb-1 fw-bold text-center">Welcome Back</h2>
              <p className="text-muted text-center mb-0">Sign in to your account</p>
            </Card.Header>
            <Card.Body className="p-4 border-top border-light">
              {error && (
                <Alert 
                  variant="danger" 
                  onClose={() => setError('')} 
                  dismissible
                  className="rounded-3"
                >
                  {error}
                </Alert>
              )}

              <div className="mb-4">
                {googleLoading ? (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading Google Sign-In...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div id="googleSignInButton" className="w-100"></div>
                )}
              </div>

              <div className="position-relative mb-4">
                <div className="divider">
                  <span className="divider-text">or</span>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Form.Label className="fw-medium">Email</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-white border-end-0">
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-start-0 rounded-end"
                      placeholder="Enter your email"
                      required
                    />
                  </InputGroup>
                </div>

                <div className="mb-4">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-white border-end-0">
                      <FaLock className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-start-0 rounded-end"
                      placeholder="Enter your password"
                      required
                    />
                  </InputGroup>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 rounded-pill"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : null}
                  Sign In
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 