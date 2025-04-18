import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import axios from '../utils/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <Container className="py-5">
      <Button
        variant="outline-secondary"
        className="mb-4 rounded-pill px-4"
        onClick={() => navigate('/')}
      >
        <FaArrowLeft className="me-2" />
        Back to Products
      </Button>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-4">
          <h2 className="mb-1 fw-bold">Add New Product</h2>
          <p className="text-muted mb-0">Fill in the details to add a new product to your inventory</p>
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
          
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    className="rounded-3 border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                    className="rounded-3 border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                required
                rows={3}
                className="rounded-3 border-0 shadow-sm"
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                    min="0"
                    step="0.01"
                    className="rounded-3 border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    required
                    min="0"
                    className="rounded-3 border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="rounded-3 border-0 shadow-sm"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                className="rounded-pill py-2"
              >
                <FaPlus className="me-2" />
                Add Product
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaCheckCircle className="text-success mb-3" style={{ fontSize: '3rem' }} />
          <h4 className="fw-bold">Product Added Successfully</h4>
          <p className="text-muted">Your product has been added to your inventory.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-secondary" 
            onClick={handleSuccessModalClose}
            className="rounded-pill px-4"
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSuccessModalClose}
            className="rounded-pill px-4"
          >
            View Products
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddProduct; 