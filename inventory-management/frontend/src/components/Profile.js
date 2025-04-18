import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
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
    },
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const getAvatarUrl = (name) => {
    // Split the name and get first letter of each word
    const words = name.trim().split(/\s+/);
    let initials = '';
    
    // For single word names (like "Sathish")
    if (words.length === 1) {
      const name = words[0];
      // Take first two characters if name is long enough
      if (name.length >= 2) {
        initials = name.substring(0, 2).toUpperCase();
      } else {
        // If name is too short, just use the first character
        initials = name[0].toUpperCase();
      }
    } else {
      // For multiple words (like "John Doe")
      initials = words[0][0].toUpperCase();
      if (words.length > 1) {
        initials += words[words.length - 1][0].toUpperCase();
      }
    }

    // Generate a consistent color based on the name
    const colors = [
      '0D47A1', // Blue
      '1B5E20', // Green
      'BF360C', // Red
      '4A148C', // Purple
      'E65100', // Orange
      '006064', // Cyan
      '3E2723', // Brown
      '263238'  // Blue Grey
    ];
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const backgroundColor = colors[colorIndex];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=150&bold=true&font-size=0.5`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          const userData = {
            ...response.data,
            address: response.data.address || {
              street: '',
              city: '',
              state: '',
              country: '',
              zipCode: ''
            },
            company: response.data.company || {
              name: '',
              position: ''
            }
          };
          // Set profile image based on name if not provided
          if (!userData.profileImage) {
            userData.profileImage = getAvatarUrl(userData.name);
          }
          setUser(userData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUser(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        user,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUser(response.data);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow">
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Settings</h5>
                <Button
                  variant={isEditing ? "outline-danger" : "outline-primary"}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                  size="sm"
                >
                  <i className={`fas fa-${isEditing ? 'times' : 'edit'} me-1`}></i>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              {success && <Alert variant="success" className="mb-4">{success}</Alert>}
              
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={user.profileImage || getAvatarUrl(user.name)}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  {isEditing && (
                    <Button
                      variant="light"
                      className="position-absolute bottom-0 end-0 rounded-circle p-2"
                      style={{
                        width: '35px',
                        height: '35px',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => {
                        // Handle image upload here if needed
                      }}
                    >
                      <i className="fas fa-camera text-primary"></i>
                    </Button>
                  )}
                </div>
                <h5 className="mt-3 mb-1">{user.name}</h5>
                <p className="text-muted small">{user.email}</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Personal Information</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="border-0 border-bottom rounded-0"
                    />
                  </Form.Group>
                </div>

                <div className="mb-4">
                  <h6 className="text-muted mb-3">Address</h6>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-muted">Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.street"
                      value={user.address.street}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="border-0 border-bottom rounded-0"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">City</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.city"
                          value={user.address.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">State</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.state"
                          value={user.address.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.country"
                          value={user.address.country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">ZIP Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.zipCode"
                          value={user.address.zipCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="mb-4">
                  <h6 className="text-muted mb-3">Company Information</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="company.name"
                          value={user.company.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Position</Form.Label>
                        <Form.Control
                          type="text"
                          name="company.position"
                          value={user.company.position}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-0 border-bottom rounded-0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {isEditing && (
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 