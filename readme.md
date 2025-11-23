# E-Commerce REST API & Frontend Demo

A Fullstack E-Commerce application built with **Node.js**, **Express**, **PostgreSQL**, and **Vanilla JS**.
This project demonstrates a complete flow of an e-commerce system, including secure authentication, role-based access control, product management with image uploads, and transactional order processing.

## Live Demo

* **Frontend (Storefront):** [[LINK_NETLIFY_KAMU_DISINI](https://rest-api-ecommerce.netlify.app/)]
* **Backend (API Docs):** [[LINK_VERCEL_KAMU_DISINI](https://rest-api-ecommerce-ruddy.vercel.app/)]

---

## Features

* **Authentication**: Secure Register & Login (JWT + Bcrypt).
* **Authorization**: RBAC (Role-Based Access Control) for Admin vs Customer.
* **Product Management**:
    * CRUD operations (Admin only).
    * **Image Upload** supported via **Cloudinary** (Production) and Local Storage (Development).
* **Order System**:
    * **ACID Transactions**: Ensures stock is deducted only when the order is successfully recorded.
    * **Order History**: Users can view their past orders.
    * **Cancellation**: Canceling an order automatically restores product stock.
* **Frontend**: A simple UI built with Bootstrap 5 and Vanilla JS (Single Page Application logic/simple standalone html file).

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL (hosted on **Supabase**)
* **ORM**: Prisma
* **Storage**: Cloudinary (for image hosting)
* **Deployment**: Vercel (Backend) & Netlify (Frontend)

---

## Installation & Local Setup

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd rest-api-ecommerce
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add the following keys:
    ```env
    # Database (Supabase/Local)
    DATABASE_URL="postgresql://user:password@host:6543/db?pgbouncer=true"
    DIRECT_URL="postgresql://user:password@host:5432/db"
    
    # Security
    JWT_SECRET="your_super_secret_key"
    
    # Image Storage (Cloudinary)
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    ```

4.  **Run Migrations**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the Server**
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:3000`.

---

## API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user | Public |
| **POST** | `/api/auth/login` | Login & get Token | Public |
| **GET** | `/api/products` | Get all products | Public |
| **POST** | `/api/products` | Create product (w/ Image) | Admin |
| **PUT** | `/api/products/:id` | Update product | Admin |
| **DELETE** | `/api/products/:id` | Delete product | Admin |
| **POST** | `/api/orders/checkout`| Create transaction | User |
| **GET** | `/api/orders/my-orders`| Get order history | User |
| **DELETE** | `/api/orders/:id/cancel`| Cancel order & restore stock | User |

---