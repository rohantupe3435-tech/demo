# System Architecture & Technical Design

This document details the architectural design, security protocols, component boundaries, and data flow mechanisms for the **Mini E-Commerce Demo Project (MERN Stack)**.

---

## 1. High-Level System Architecture

The application adopts a decoupled client-server architecture:
* **Presentation Layer (`/client`)**: React Single Page Application (SPA) bundled with Vite, styled with Tailwind CSS, communicating asynchronously via Axios.
* **API / Application Layer (`/server`)**: Node.js runtime executing an Express.js REST application with modular controllers, service helpers, and middleware pipelines.
* **Persistence Layer (`MongoDB`)**: Document database accessed via Mongoose ODM for schema enforcement, validation, indexing, and relational references.

```mermaid
graph TD
    subgraph Client ["Client Layer (React + Vite + Tailwind CSS)"]
        UI["Customer Storefront & Admin Views"]
        State["Context State (AuthContext, CartContext)"]
        Axios["Axios API Client (with JWT Interceptors)"]
        UI --> State
        State --> Axios
    end

    subgraph Gateway ["Express.js REST API Server"]
        Router["Express Router /api/..."]
        AuthMW["Auth Middleware (JWT Verify)"]
        AdminMW["Admin Role Middleware"]
        Controller["Controllers (Auth, Category, Product, Order)"]
        
        Axios -->|HTTP Request| Router
        Router -->|Protected Customer Routes| AuthMW
        AuthMW -->|Protected Admin Routes| AdminMW
        Router -->|Public Routes| Controller
        AuthMW --> Controller
        AdminMW --> Controller
    end

    subgraph Database ["Persistence Layer (MongoDB)"]
        Mongoose["Mongoose ODM (Schema & Validation)"]
        UserCol[("Users Collection")]
        CatCol[("Categories Collection")]
        ProdCol[("Products Collection")]
        OrderCol[("Orders Collection")]

        Controller --> Mongoose
        Mongoose --> UserCol
        Mongoose --> CatCol
        Mongoose --> ProdCol
        Mongoose --> OrderCol
    end
```

---

## 2. Authentication & Authorization Lifecycle

Role-based access control (RBAC) separates **Customer** and **Admin** permissions using JSON Web Tokens (JWT).

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Admin
    participant Client as React Client (Axios)
    participant AuthAPI as Express Auth Controller
    participant DB as MongoDB (Users)

    Note over User, DB: Registration / Login Flow
    User->>Client: Enters credentials (Email, Password)
    Client->>AuthAPI: POST /api/auth/login
    AuthAPI->>DB: Query User by email
    DB-->>AuthAPI: User record (including hashed password & role)
    AuthAPI->>AuthAPI: Compare password with bcrypt.compare()
    alt Invalid Credentials
        AuthAPI-->>Client: 401 Unauthorized (Invalid credentials)
        Client-->>User: Display Toast Error
    else Valid Credentials
        AuthAPI->>AuthAPI: Sign JWT with payload { id, role } (expiry: 30d)
        AuthAPI-->>Client: 200 OK + { token, user: { id, name, email, role } }
        Client->>Client: Store token & user in localStorage & AuthContext
        Client-->>User: Redirect to Storefront or Admin Dashboard
    end

    Note over User, DB: Authenticated Request Flow
    User->>Client: Access Protected Resource
    Client->>AuthAPI: GET/POST with Header: Authorization: Bearer <token>
    AuthAPI->>AuthAPI: Verify JWT signature & expiration
    alt Token Invalid / Expired
        AuthAPI-->>Client: 401 Unauthorized
    else Token Valid
        AuthAPI->>AuthAPI: Attach req.user = decoded
        alt Route requires Admin and req.user.role !== 'admin'
            AuthAPI-->>Client: 403 Forbidden (Admin resource only)
        else Authorized
            AuthAPI->>DB: Perform authorized query
            DB-->>AuthAPI: Query Result
            AuthAPI-->>Client: 200 OK with Data
        end
    end
```

---

## 3. Order Processing & Inventory Flow

To guarantee transaction integrity and avoid fraud, **the client never dictates product prices or stock deductions**. All calculations are performed server-side.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant CartUI as Cart Page
    participant OrderAPI as POST /api/orders
    participant ProdDB as Products Collection
    participant OrderDB as Orders Collection

    Customer->>CartUI: Clicks "Place Order" (Cash on Delivery)
    CartUI->>OrderAPI: Send payload: { items: [{ product: id, quantity }], shippingAddress }
    
    Note over OrderAPI, ProdDB: Step 1: Validate Stock & Fetch Authentic Prices
    loop For each item in payload.items
        OrderAPI->>ProdDB: Find Product by ID
        ProdDB-->>OrderAPI: Product document (price, stock, name)
        OrderAPI->>OrderAPI: Verify: requestedQuantity <= availableStock
        alt Insufficient Stock
            OrderAPI-->>CartUI: 400 Bad Request ("Insufficient stock for product X")
            CartUI-->>Customer: Display error toast & adjust cart
        end
        OrderAPI->>OrderAPI: itemTotal = dbProduct.price * quantity
        OrderAPI->>OrderAPI: accumulate totalAmount += itemTotal
    end

    Note over OrderAPI, OrderDB: Step 2: Atomic Persistence & Stock Decrement
    OrderAPI->>OrderDB: Create Order document (status: "Pending", paymentMethod: "COD")
    OrderDB-->>OrderAPI: Order Created
    
    loop For each item in order
        OrderAPI->>ProdDB: updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
    end

    OrderAPI-->>CartUI: 201 Created + Order Object
    CartUI->>CartUI: Clear Local Cart State & localStorage
    CartUI-->>Customer: Redirect to "My Orders" with success confirmation
```

---

## 4. Frontend State Architecture

```mermaid
graph LR
    subgraph Contexts ["React Context Providers"]
        AuthCtx["AuthContext\n- user\n- token\n- login()\n- register()\n- logout()\n- isAdmin"]
        CartCtx["CartContext\n- cartItems\n- addToCart()\n- updateQty()\n- removeFromCart()\n- clearCart()\n- cartTotal\n- cartCount"]
    end

    subgraph Consumers ["Consuming Components"]
        Nav["Navbar (Cart count badge, User/Admin menu)"]
        PLP["Product Listing (Add to Cart with stock check)"]
        PDP["Product Details (Qty selector <= stock)"]
        CartP["Cart & Checkout Pages"]
        AdminP["Admin Dashboard & Route Guards"]
    end

    AuthCtx --> Nav
    AuthCtx --> AdminP
    CartCtx --> Nav
    CartCtx --> PLP
    CartCtx --> PDP
    CartCtx --> CartP
```

* **Stock Safeguards**: The `CartContext` checks item stock before incrementing. If an item has `stock: 3`, the quantity selector disables increment at `3`.
* **Axios Interceptor**: Automatically attaches `Authorization: Bearer <token>` to all outgoing requests and catches `401 Unauthorized` responses to trigger clean logouts.

---

## 5. Security & Data Integrity Matrix

| Risk | Mitigation Strategy | Implemented In |
| :--- | :--- | :--- |
| **Client-Side Price Tampering** | Backend fetches product price from DB; ignores any price sent in request body | `orderController.js` |
| **Overselling / Negative Stock** | Backend validates `stock >= quantity` and rejects orders before decrementing | `orderController.js` |
| **Unauthorized Admin Access** | Multi-layered route protection: JWT verification + `req.user.role === 'admin'` check | `authMiddleware.js`, `adminMiddleware.js` |
| **Password Exposure** | Passwords hashed using bcrypt (10 rounds); passwords excluded from JSON queries (`select("-password")`) | `User.js`, `authController.js` |
| **Database Injection** | Strict Mongoose Schema typing and object parameterization | All Mongoose Models |
| **Invalid Enum Statuses** | Order status strictly bounded to `['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']` | `Order.js` model & status controller |
