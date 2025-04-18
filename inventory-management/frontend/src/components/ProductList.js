import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Alert, Container, Badge, InputGroup, Form, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showMyProducts, setShowMyProducts] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchProducts();
  }, [showMyProducts]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      }
    }
  };

  const isProductOwner = (product) => {
    if (showMyProducts) return true;
    return currentUser && product.user && product.user._id === currentUser._id;
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          showMyProducts: showMyProducts
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch products. Please try again.');
      }
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(product => product.category))];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">{showMyProducts ? 'My Products' : 'All Products'}</h2>
              <p className="text-muted mb-0">
                {showMyProducts ? 'Manage your inventory items' : 'Browse through all available products'}
              </p>
            </div>
            <div className="d-flex gap-3">
              <ButtonGroup>
                <Button
                  variant={showMyProducts ? "primary" : "outline-primary"}
                  onClick={() => setShowMyProducts(true)}
                >
                  <FaUser className="me-2" />
                  My Products
                </Button>
                <Button
                  variant={!showMyProducts ? "primary" : "outline-primary"}
                  onClick={() => setShowMyProducts(false)}
                >
                  <FaBoxOpen className="me-2" />
                  All Products
                </Button>
              </ButtonGroup>
              <Button as={Link} to="/add" variant="success">
                <FaPlus className="me-2" />
                Add New Product
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <FaBoxOpen className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                <h4>No Products Found</h4>
                <p className="text-muted">
                  {showMyProducts
                    ? "You haven't added any products yet."
                    : "No products match your search criteria. Try adjusting your filters."}
                </p>
                {showMyProducts && (
                  <Button as={Link} to="/add" variant="primary" className="mt-3">
                    <FaPlus className="me-2" />
                    Add Your First Product
                  </Button>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product._id}>
                  <Card className="h-100 product-card">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000/${product.image}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                        className="product-image"
                      />
                      <Badge 
                        bg={product.quantity > 0 ? "success" : "danger"} 
                        className="position-absolute top-0 end-0 m-2"
                      >
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="product-creator mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <FaUser className="text-muted me-2" />
                          <small className="text-muted">Added by: {product.user?.name || 'Unknown'}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="text-muted me-2" />
                          <small className="text-muted">Added on: {formatDate(product.createdAt)}</small>
                        </div>
                      </div>
                      <Card.Title className="text-truncate">{product.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
                      <Card.Text className="flex-grow-1 text-muted">
                        {product.description}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-primary mb-0">${product.price}</h5>
                          <small className="text-muted">Quantity: {product.quantity}</small>
                        </div>
                        {isProductOwner(product) && (
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              as={Link}
                              to={`/edit/${product._id}`}
                              size="sm"
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDeleteClick(product)}
                              size="sm"
                            >
                              <FaTrash className="me-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList; 