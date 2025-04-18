import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: null
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        image: null
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details. Please try again.');
    }
  };

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
        navigate('/login');
        return;
      }

      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to update product. Please try again.');
      }
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <h2 className="mb-0">Edit Product</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                required
                rows={3}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Product Image (Leave empty to keep current image)</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Only image files are allowed. Maximum file size: 5MB
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Product
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProduct; 