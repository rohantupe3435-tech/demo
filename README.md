# Mini E-Commerce Demo Project (MERN Stack)

A lightweight, modern, and production-ready **Mini E-Commerce Platform** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**.

This repository contains the complete technical design, architectural specifications, database models, API documentation, and implementation roadmap.

---

## 📌 Project Overview

This project is a clean, streamlined e-commerce application demonstrating core online shopping and administrative workflows without unnecessary bloat (no third-party payment gateways, complex supplier portals, or multi-vendor setups).

### Key Features
* **Role-Based Authentication**: JWT-based authentication with bcrypt password hashing for **Customer** and **Admin** roles.
* **Modern Customer Storefront**: Responsive catalog, category filtering, keyword search, product details, dynamic cart, and cash-on-delivery (COD) checkout.
* **Robust Order & Inventory Engine**: Server-side price verification (never trusting client prices), automated inventory stock reduction, and order tracking.
* **Dedicated Admin Panel**: Protected admin dashboard to manage product categories, product catalog, and monitor/update order fulfillment statuses.
* **Clean MERN Architecture**: Clear separation of concerns with `/client` (Vite + React) and `/server` (Node + Express + MongoDB).

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Fast modern single-page application framework |
| **Styling** | Tailwind CSS | Utility-first, responsive, and modern UI design |
| **Icons & UI** | Lucide React | Clean, consistent icons |
| **HTTP Client** | Axios | Promise-based HTTP client with auth interceptors |
| **Backend** | Node.js + Express.js | RESTful API server with modular routing and middleware |
| **Database** | MongoDB + Mongoose | Document-oriented database with strict schema validation |
| **Auth & Security** | JWT + bcryptjs | Token-based auth, secure password hashing, and role checks |

---

## 🗂 Project Directory Structure

```text
demo-project/
├── client/                     # React.js Frontend (Vite + Tailwind CSS)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── assets/             # Brand logos & media assets
│   │   ├── components/         # Shared & reusable UI components
│   │   │   ├── common/         # Navbar, Footer, Modal, Toast, Loader
│   │   │   ├── admin/          # Admin Sidebar, StatCard, OrderTable
│   │   │   └── product/        # ProductCard, CategoryFilter, SearchBar
│   │   ├── context/            # Global state (AuthContext, CartContext)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── pages/              # Customer & Admin views
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminCategories.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminOrders.jsx
│   │   ├── services/           # Axios API service modules
│   │   ├── App.jsx             # Main routing configuration
│   │   ├── index.css           # Tailwind CSS directives & custom styles
│   │   └── main.jsx            # React root entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express.js Backend
│   ├── src/
│   │   ├── config/             # DB connection & environment config
│   │   │   └── db.js
│   │   ├── controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── productController.js
│   │   │   └── orderController.js
│   │   ├── middleware/         # Auth, admin verification, and error handling
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/             # REST API route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── utils/              # Token generation, helpers, seeders
│   │   └── server.js           # Express app setup and server listener
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── docs/                       # Technical Specifications & Documentation
│   ├── ARCHITECTURE.md         # System design & data flow architecture
│   ├── API_SPECIFICATION.md    # Complete REST API reference
│   ├── DATABASE_MODELS.md      # Mongoose schema definitions & data dictionary
│   ├── FRONTEND_SPECIFICATION.md # UI/UX guidelines, design tokens & pages
│   └── IMPLEMENTATION_PLAN.md  # Step-by-step phased execution plan
│
└── README.md                   # Project overview & quick start
```

---

## 🚀 Complete Demo Workflow

```text
Admin Login
   │
   ▼
Add Category (e.g., Electronics, Fashion, Shoes)
   │
   ▼
Add Product (Image, Name, Price, Stock, Category)
   │
   ▼
Product Instantly Appears on Public Storefront
   │
   ▼
Customer Registers / Logs In
   │
   ▼
Browse Products ──► Search by Name ──► Filter by Category
   │
   ▼
Add Product to Cart (Qty limited to current available stock)
   │
   ▼
Proceed to Checkout (Shipping Address + Cash on Delivery)
   │
   ▼
Place Order:
  ├─ Server recalculates price from DB (prevents tampering)
  ├─ Server checks and decrements product inventory
  ├─ Order saved to MongoDB with status "Pending"
  └─ Cart cleared in client
   │
   ▼
Customer views Order in "My Orders"
   │
   ▼
Admin views Order in "Admin Panel" & updates status:
  [Pending] ──► [Confirmed] ──► [Shipped] ──► [Delivered]
```

---

## 🔒 Security & Validation Principles

1. **Server-Side Price Verification**: Never trust product prices submitted by the client browser. Prices and inventory are re-queried directly from MongoDB inside the order controller.
2. **Atomic Inventory Check**: Prior to confirming an order, each item's stock is validated to ensure `stock >= requestedQuantity`. Stock is reduced upon order creation.
3. **Password Security**: Passwords are encrypted using `bcryptjs` with salt rounds before storing in the database.
4. **JWT Protected Routes**: Middleware validates Bearer tokens on protected endpoints, attaching the authenticated user payload (`req.user`) to incoming requests.
5. **Admin Authorization**: `adminMiddleware` strictly restricts administrative routes to users with `role: "admin"`.
6. **Input Sanitization & Validation**: Validation on both client and server for required fields, email format, minimum password length (6 characters), positive prices, non-negative stock, and valid category references.

---

## 📚 Technical Documentation Index

For in-depth architectural and implementation details, refer to the documentation files:

* 📄 [Architecture & Data Flow](file:///c:/Users/Rohan%20Tupe/OneDrive/Desktop/demo%20project/docs/ARCHITECTURE.md)
* 📄 [API Specifications & Routes](file:///c:/Users/Rohan%20Tupe/OneDrive/Desktop/demo%20project/docs/API_SPECIFICATION.md)
* 📄 [Database Models & Schemas](file:///c:/Users/Rohan%20Tupe/OneDrive/Desktop/demo%20project/docs/DATABASE_MODELS.md)
* 📄 [Frontend UI/UX Specification](file:///c:/Users/Rohan%20Tupe/OneDrive/Desktop/demo%20project/docs/FRONTEND_SPECIFICATION.md)
* 📄 [Implementation Roadmap](file:///c:/Users/Rohan%20Tupe/OneDrive/Desktop/demo%20project/docs/IMPLEMENTATION_PLAN.md)

---

## 📄 License

This project is licensed under the MIT License.
