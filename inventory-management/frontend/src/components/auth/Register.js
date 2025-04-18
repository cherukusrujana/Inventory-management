import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import axios from '../../utils/axios';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    company: {
      name: '',
      position: ''
    }
  });

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email,
        name: location.state.name || ''
      }));
      setError(location.state.message || '');
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/register', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h4 className="text-center mb-0">
                <FaUser className="me-2" />
                Register
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-start-0 rounded-end"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-start-0 rounded-end"
                          placeholder="Enter your email"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="border-start-0 rounded-end"
                          placeholder="Enter your password"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaPhone />
                        </span>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-start-0 rounded-end"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mt-4 mb-3">
                  <FaMapMarkerAlt className="me-2" />
                  Address
                </h5>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter street address"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter city"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter state"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter country"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter ZIP code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mt-4 mb-3">
                  <FaBuilding className="me-2" />
                  Company
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="company.name"
                        value={formData.company.name}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter company name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="text"
                        name="company.position"
                        value={formData.company.position}
                        onChange={handleChange}
                        className="rounded-pill"
                        placeholder="Enter your position"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Login here
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

export default Register; 