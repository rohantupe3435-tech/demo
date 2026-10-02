# REST API Specification

This document provides the complete API reference for the **Mini E-Commerce Demo Project**, including request/response schemas, query parameters, authentication scopes, and status codes.

---

## 🌐 General Information

* **Base URL**: `http://localhost:5000/api`
* **Content-Type**: `application/json`
* **Authentication**: Bearer Token in HTTP Authorization Header:
  ```http
  Authorization: Bearer <jwt_token>
  ```

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Customer / Admin Registration
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Description**: Registers a new customer user (default `role: "customer"`). Validates email uniqueness and password match.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Validation Rules
* `name`: Required, string, trimmed.
* `email`: Required, valid email format, unique.
* `password`: Required, minimum 6 characters.
* `confirmPassword`: Must match `password`.

#### Response `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "651a2f1b4f1b2c001f3e4a50",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 1.2 User / Admin Login
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Description**: Authenticates either Customer or Admin, returning a JWT token with user role.

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "651a2f1b4f1b2c001f3e4a51",
    "name": "Store Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 2. Category APIs (`/api/categories`)

### 2.1 Get All Categories
* **Endpoint**: `GET /api/categories`
* **Access**: Public
* **Response `200 OK`**:
```json
{
  "success": true,
  "count": 4,
  "categories": [
    {
      "_id": "651a2f1b4f1b2c001f3e4b01",
      "name": "Electronics",
      "description": "Smartphones, laptops, accessories",
      "createdAt": "2026-10-02T10:00:00.000Z"
    },
    {
      "_id": "651a2f1b4f1b2c001f3e4b02",
      "name": "Fashion",
      "description": "Apparel, clothing, everyday wear",
      "createdAt": "2026-10-02T10:00:00.000Z"
    }
  ]
}
```

### 2.2 Add Category
* **Endpoint**: `POST /api/categories`
* **Access**: Protected (Admin only)
* **Request Body**:
```json
{
  "name": "Shoes",
  "description": "Casual, running, and formal shoes"
}
```
* **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "651a2f1b4f1b2c001f3e4b03",
    "name": "Shoes",
    "description": "Casual, running, and formal shoes"
  }
}
```

### 2.3 Edit Category
* **Endpoint**: `PUT /api/categories/:id`
* **Access**: Protected (Admin only)
* **Request Body**:
```json
{
  "name": "Footwear & Shoes",
  "description": "Updated category description"
}
```
* **Response `200 OK`**: Updated category object.

### 2.4 Delete Category
* **Endpoint**: `DELETE /api/categories/:id`
* **Access**: Protected (Admin only)
* **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Category removed successfully"
}
```

---

## 3. Product APIs (`/api/products`)

### 3.1 Get All Products (Filter & Search)
* **Endpoint**: `GET /api/products`
* **Access**: Public
* **Query Parameters**:
  * `category` (optional): Category ID or slug
  * `search` (optional): Text search query against product name or description
* **Example**: `GET /api/products?category=651a2f1b4f1b2c001f3e4b01&search=phone`
* **Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "products": [
    {
      "_id": "651a2f1b4f1b2c001f3e4c10",
      "name": "Wireless Noise Cancelling Headphones",
      "description": "High fidelity audio with 40-hour battery life",
      "price": 149.99,
      "image": "https://images.unsplash.com/photo-505740420928-5e560c06d30e",
      "category": {
        "_id": "651a2f1b4f1b2c001f3e4b01",
        "name": "Electronics"
      },
      "stock": 15,
      "createdAt": "2026-10-02T10:15:00.000Z"
    }
  ]
}
```

### 3.2 Get Single Product Details
* **Endpoint**: `GET /api/products/:id`
* **Access**: Public
* **Response `200 OK`**:
```json
{
  "success": true,
  "product": {
    "_id": "651a2f1b4f1b2c001f3e4c10",
    "name": "Wireless Noise Cancelling Headphones",
    "description": "High fidelity audio with 40-hour battery life",
    "price": 149.99,
    "image": "https://images.unsplash.com/photo-505740420928-5e560c06d30e",
    "category": {
      "_id": "651a2f1b4f1b2c001f3e4b01",
      "name": "Electronics"
    },
    "stock": 15
  }
}
```

### 3.3 Add Product
* **Endpoint**: `POST /api/products`
* **Access**: Protected (Admin only)
* **Request Body**:
```json
{
  "name": "Running Athletic Sneakers",
  "description": "Lightweight breathable mesh sneakers",
  "price": 89.99,
  "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "category": "651a2f1b4f1b2c001f3e4b03",
  "stock": 25
}
```
* **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "651a2f1b4f1b2c001f3e4c11",
    "name": "Running Athletic Sneakers",
    "price": 89.99,
    "stock": 25,
    "category": "651a2f1b4f1b2c001f3e4b03"
  }
}
```

### 3.4 Edit Product
* **Endpoint**: `PUT /api/products/:id`
* **Access**: Protected (Admin only)
* **Request Body**: Any editable fields (`name`, `description`, `price`, `image`, `category`, `stock`)
* **Response `200 OK`**: Updated product object.

### 3.5 Delete Product
* **Endpoint**: `DELETE /api/products/:id`
* **Access**: Protected (Admin only)
* **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 4. Order APIs (`/api/orders` & `/api/admin/orders`)

### 4.1 Place Order (Checkout)
* **Endpoint**: `POST /api/orders`
* **Access**: Protected (Customer / Authenticated User)
* **Note**: The client sends only product IDs and quantities. Prices are queried securely on the backend from MongoDB.
* **Request Body**:
```json
{
  "products": [
    {
      "product": "651a2f1b4f1b2c001f3e4c10",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+1-555-0199",
    "address": "456 Market St, Apt 2B",
    "city": "San Francisco",
    "pincode": "94105"
  }
}
```
* **Validation & Business Logic**:
  * Verifies each item exists and `stock >= quantity`.
  * Multiplies DB price by quantity and computes `totalAmount`.
  * Creates order with `status: "Pending"`.
  * Decrements product `stock` by ordered quantity.
* **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "651a2f1b4f1b2c001f3e4d90",
    "user": "651a2f1b4f1b2c001f3e4a50",
    "products": [
      {
        "product": "651a2f1b4f1b2c001f3e4c10",
        "quantity": 2,
        "price": 149.99
      }
    ],
    "totalAmount": 299.98,
    "shippingAddress": {
      "name": "John Doe",
      "phone": "+1-555-0199",
      "address": "456 Market St, Apt 2B",
      "city": "San Francisco",
      "pincode": "94105"
    },
    "status": "Pending",
    "createdAt": "2026-10-02T10:30:00.000Z"
  }
}
```

---

### 4.2 Get Customer Order History
* **Endpoint**: `GET /api/orders/my-orders`
* **Access**: Protected (Customer)
* **Description**: Returns all orders placed by the currently logged-in user, sorted newest first.
* **Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "orders": [
    {
      "_id": "651a2f1b4f1b2c001f3e4d90",
      "products": [
        {
          "product": {
            "_id": "651a2f1b4f1b2c001f3e4c10",
            "name": "Wireless Noise Cancelling Headphones",
            "image": "https://..."
          },
          "quantity": 2,
          "price": 149.99
        }
      ],
      "totalAmount": 299.98,
      "status": "Pending",
      "createdAt": "2026-10-02T10:30:00.000Z"
    }
  ]
}
```

---

### 4.3 Get All Customer Orders (Admin)
* **Endpoint**: `GET /api/admin/orders`
* **Access**: Protected (Admin only)
* **Description**: Lists all customer orders across the platform with customer details and item summaries.
* **Response `200 OK`**:
```json
{
  "success": true,
  "count": 12,
  "orders": [
    {
      "_id": "651a2f1b4f1b2c001f3e4d90",
      "user": {
        "_id": "651a2f1b4f1b2c001f3e4a50",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "products": [...],
      "totalAmount": 299.98,
      "shippingAddress": {...},
      "status": "Pending",
      "createdAt": "2026-10-02T10:30:00.000Z"
    }
  ]
}
```

---

### 4.4 Update Order Status (Admin)
* **Endpoint**: `PATCH /api/admin/orders/:id/status`
* **Access**: Protected (Admin only)
* **Allowed Statuses**: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`
* **Request Body**:
```json
{
  "status": "Shipped"
}
```
* **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Order status updated to Shipped",
  "order": {
    "_id": "651a2f1b4f1b2c001f3e4d90",
    "status": "Shipped",
    "updatedAt": "2026-10-02T11:00:00.000Z"
  }
}
```

---

## 5. Standard Error Responses

All API errors return a standard JSON structure:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| HTTP Status | Reason | Trigger Scenario |
| :--- | :--- | :--- |
| `400 Bad Request` | Validation Failure | Missing field, invalid email, quantity > available stock |
| `401 Unauthorized` | Auth Required | Missing or invalid Bearer JWT token |
| `403 Forbidden` | Insufficient Permissions | Customer trying to call `/api/admin/*` or `/api/categories` POST/PUT/DELETE |
| `404 Not Found` | Entity Missing | Non-existent Product ID, Order ID, or Category ID |
| `500 Server Error` | Uncaught Exception | Database connection failure, internal server errors |
