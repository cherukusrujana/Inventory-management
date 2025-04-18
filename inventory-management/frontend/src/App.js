import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/custom.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import GoogleCallback from './components/auth/GoogleCallback';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/" element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App; 