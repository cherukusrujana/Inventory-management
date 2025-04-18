# Inventory Management System

A full-stack inventory management system built with React, Node.js, Express, and MongoDB.

## Features

- Add, edit, and delete products
- Upload product images
- View product list with images
- Responsive design using Bootstrap
- RESTful API backend

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/inventory-management
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
inventory-management/
├── backend/
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── products.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── ProductList.js
    │   │   ├── AddProduct.js
    │   │   └── EditProduct.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## API Endpoints

- GET /api/products - Get all products
- GET /api/products/:id - Get a single product
- POST /api/products - Create a new product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product

## Technologies Used

- Frontend:
  - React
  - React Router
  - Bootstrap
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Multer (for file uploads) 