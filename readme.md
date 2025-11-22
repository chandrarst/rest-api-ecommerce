# E-Commerce REST API Backend

This repository contains the backend source code for a robust E-Commerce application. It is built using Node.js and Express, utilizing PostgreSQL as the relational database and Prisma as the ORM.

The system is designed to handle essential e-commerce functionalities including user authentication (JWT), role-based access control (Admin/Customer), product management, and secure order processing with ACID-compliant database transactions to ensure data integrity between stock inventory and order records.

## Tech Stack

* **Runtime Environment**: Node.js
* **Framework**: Express.js
* **Database**: PostgreSQL (via Docker)
* **ORM**: Prisma
* **Authentication**: JSON Web Token (JWT) & Bcrypt
* **Containerization**: Docker & Docker Compose

## Features

* **Secure Authentication**: User registration and login mechanisms using hashed passwords and JWT for session management.
* **Role-Based Access Control (RBAC)**: Middleware to differentiate between 'Customer' and 'Admin' roles, restricting sensitive endpoints.
* **Product Management**: Full CRUD capabilities for administrators to manage inventory.
* **Transactional Orders**: Implementation of database transactions (`prisma.$transaction`) to ensure that order creation and stock deduction happen atomically. If one fails, both rollback.
* **Order History & Cancellation**: Users can view their specific order history and cancel orders, which automatically restores the product stock.

---

## API Documentation

### 1. Authentication

**Base URL**: `/api/auth`

#### Register New User
Creates a new user account. Default role is 'CUSTOMER'.

* **URL**: `/register`
* **Method**: `POST`
* **Access**: Public
* **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```

#### Login
Authenticates a user and returns a JWT (Bearer Token) for accessing protected routes.

* **URL**: `/login`
* **Method**: `POST`
* **Access**: Public
* **Request Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
* **Response**:
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR...",
      "user": { "id": 1, "role": "CUSTOMER" }
    }
    ```

---

### 2. Products

**Base URL**: `/api/products`

#### Get All Products
Retrieves a list of all available products.

* **URL**: `/`
* **Method**: `GET`
* **Access**: Public

#### Create Product
Adds a new product to the inventory.

* **URL**: `/`
* **Method**: `POST`
* **Access**: Admin Only
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
    ```json
    {
      "name": "Gaming Laptop",
      "description": "High performance laptop",
      "price": 15000000,
      "stock": 10
    }
    ```

#### Update Product
Updates an existing product's details.

* **URL**: `/:id`
* **Method**: `PUT`
* **Access**: Admin Only
* **Headers**: `Authorization: Bearer <token>`
* **Request Body** (All fields optional):
    ```json
    {
      "price": 14500000,
      "stock": 15
    }
    ```

#### Delete Product
Removes a product from the database. Note: Products with existing transaction history cannot be deleted to preserve data integrity.

* **URL**: `/:id`
* **Method**: `DELETE`
* **Access**: Admin Only
* **Headers**: `Authorization: Bearer <token>`

---

### 3. Orders

**Base URL**: `/api/orders`

#### Checkout (Create Order)
Processes a transaction. This endpoint validates stock availability, deducts stock, and records the order within a single database transaction.

* **URL**: `/checkout`
* **Method**: `POST`
* **Access**: Customer (Authenticated)
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
    ```json
    {
      "items": [
        { "productId": 1, "quantity": 1 },
        { "productId": 2, "quantity": 3 }
      ]
    }
    ```

#### Get My Orders
Retrieves the order history for the currently logged-in user.

* **URL**: `/my-orders`
* **Method**: `GET`
* **Access**: Customer (Authenticated)
* **Headers**: `Authorization: Bearer <token>`

#### Cancel Order
Cancels a pending order and automatically restores the stock quantities to the products.

* **URL**: `/:id/cancel`
* **Method**: `DELETE`
* **Access**: Customer (Authenticated)
* **Headers**: `Authorization: Bearer <token>`

---

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd rest-api-ecommerce
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file based on `.env.example` and configure your database credentials and JWT secret.

4.  **Database Setup (Docker)**
    ```bash
    docker-compose up -d
    ```

5.  **Run Migrations**
    ```bash
    npx prisma migrate dev --name init
    ```

6.  **Start the Server**
    ```bash
    npm run dev
    ```