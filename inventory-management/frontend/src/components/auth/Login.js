import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import axios from '../../utils/axios';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (response) => {
    localStorage.setItem('token', response.token);
    navigate('/');
  };

  const handleGoogleError = (error) => {
    setError(error.message || 'Google login failed');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={5} md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-4">
              <h4 className="text-center mb-1 fw-bold">
                <FaUser className="me-2" />
                Welcome Back
              </h4>
              <p className="text-center text-muted mb-0">Sign in to your account</p>
            </Card.Header>
            <Card.Body className="p-4">
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
              
              <div className="text-center mb-4">
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
                <div className="position-relative my-4">
                  <hr className="my-0" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                    or continue with email
                  </span>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <FaUser className="text-muted" />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-0 rounded-end shadow-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <FaLock className="text-muted" />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="border-0 rounded-end shadow-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="me-2 fa-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Register here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 