⚡ FlashSale — Modern Full-Stack E-Commerce Platform

<p align="center">
  <strong>A modern, responsive e-commerce platform built with React and designed with a production-oriented architecture.</strong>
</p>

<p align="center">
  <a href="https://flash-sale-gamma.vercel.app/login">🌐 Live Demo</a>
  •
  <a href="#-features">Features</a>
  •
  <a href="#-tech-stack">Tech Stack</a>
  •
  <a href="#-project-structure">Project Structure</a>
</p>

🌐 Live Demo

Try FlashSale:
https://flash-sale-gamma.vercel.app/login

The current live deployment showcases the completed React frontend. Backend integration with Spring Boot, JWT authentication, and MySQL is planned as the next development phase.

📖 About The Project

FlashSale is a modern e-commerce web application created to simulate a real-world online shopping platform.

The project focuses on building a clean and responsive user experience while following scalable frontend architecture and reusable component patterns.

It includes two major experiences:

🛒 Customer Shopping Experience

🛠️ Admin Product Management Experience

The frontend currently uses mock data and React Context for application state. The next phase will connect the application to a Java Spring Boot REST API with MySQL, Spring Security, and JWT-based authentication.

✨ Key Features

🛍️ Customer Experience

🔐 Login and Signup

🏠 Modern e-commerce homepage

🔎 Product search interface

🗂️ Product category navigation

🛒 Add to cart

➕➖ Cart quantity management

💰 Price, discount and savings calculation

❤️ Wishlist management

📦 Product details

🧾 Checkout flow

📍 Delivery address form

💳 Multiple payment method UI

✅ Order placement

📋 Order history

🔍 Detailed order view

🚚 Order status tracking

👤 Customer profile

🔒 Protected customer routes

📱 Responsive mobile experience

🛠️ Admin Experience

📊 Admin dashboard

💵 Revenue overview

📦 Order statistics

🛍️ Product statistics

👥 User statistics

📈 Sales visualization

📊 Order status visualization

🧾 Recent orders

🔥 Top products

🔎 Product search

🗂️ Category filtering

➕ Add products

✏️ Edit products

🗑️ Delete products

📱 Responsive admin interface

🎨 UI & Design

FlashSale follows a clean SaaS-style e-commerce interface with:

Responsive layouts

Reusable UI components

Consistent spacing and typography

Modern cards and dashboards

Interactive hover states

Responsive navigation

Mobile-friendly layouts

Clear visual hierarchy

Customer and admin-specific interfaces

The interface is designed to work across:

Desktop
Tablet
Mobile

🧰 Tech Stack

Frontend

Technology

Purpose

React

UI development

Vite

Development & build tooling

JavaScript

Application logic

React Router

Client-side routing

Context API

Global state management

Tailwind CSS

Responsive styling

Axios

HTTP client

Lucide React

UI icons

Recharts

Admin dashboard charts

Planned Backend

Technology

Purpose

Java 21

Backend development

Spring Boot

REST API development

Spring Security

Authentication & authorization

JWT

Token-based authentication

BCrypt

Password hashing

Spring Data JPA

Data access

Hibernate

ORM

MySQL

Relational database

🏗️ Application Architecture

The frontend is organized into reusable layers:

React UI
   │
   ├── Pages
   │
   ├── Components
   │
   ├── Context
   │
   ├── Hooks
   │
   ├── Services
   │
   └── Utilities

The planned full-stack architecture:

┌─────────────────────────────┐
│        React Frontend       │
│                             │
│ Pages • Components • State  │
└──────────────┬──────────────┘
               │
               │ REST API / Axios
               ▼
┌─────────────────────────────┐
│       Spring Boot API       │
│                             │
│ Controller → Service        │
│      → Repository            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           MySQL             │
│                             │
│ Users • Products • Orders   │
│ Cart • Wishlist • Categories│
└─────────────────────────────┘

📁 Project Structure

flashsale/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order/
│   │   └── admin/
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── OrderContext.jsx
│   │   └── WishlistContext.jsx
│   │
│   ├── data/
│   │   └── products.js
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── customer/
│   │   └── admin/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md

🧭 Main Application Routes

Customer Routes

Route

Purpose

/login

User authentication

/signup

User registration

/home

Main shopping dashboard

/products/:productId

Product details

/cart

Shopping cart

/checkout

Checkout

/orders

Order history

/orders/:orderId

Order details

/wishlist

Saved products

/profile

Customer profile

Admin Routes

Route

Purpose

/admin

Admin dashboard

/admin/products

Product management

🔄 Customer Shopping Flow

           Login / Signup
                 │
                 ▼
              Home
                 │
        ┌────────┴────────┐
        ▼                 ▼
     Browse           Categories
     Products
        │
        ▼
 Product Details
        │
        ▼
   Add to Cart
        │
        ▼
       Cart
        │
        ▼
    Checkout
        │
        ▼
  Place Order
        │
        ▼
Order Confirmation
        │
        ▼
 Order History
        │
        ▼
 Order Details

🛡️ Security Architecture — Planned

The current frontend provides client-side protected routes for the UI experience.

The production authentication layer will be implemented in the Spring Boot backend using:

User Registration
       ↓
BCrypt Password Hashing
       ↓
Login
       ↓
JWT Access Token
       ↓
Protected REST APIs
       ↓
Role-Based Authorization

Planned Roles

CUSTOMER
ADMIN

Planned Security Features

JWT authentication

Refresh token mechanism

BCrypt password hashing

Protected REST endpoints

Role-based authorization

Admin-only product operations

Customer-specific resources

📊 State Management

FlashSale currently uses React Context API for application-wide state.

Authentication

AuthContext
    │
    ├── user
    ├── isAuthenticated
    ├── login()
    ├── logout()
    └── updateProfile()

Cart

CartContext
    │
    ├── cartItems
    ├── cartCount
    ├── subtotal
    ├── savings
    ├── deliveryCharge
    ├── total
    ├── addToCart()
    ├── updateQuantity()
    └── removeFromCart()

Orders

OrderContext
    │
    ├── orders
    ├── addOrder()
    └── getOrderById()

Wishlist

WishlistContext
    │
    ├── wishlistItems
    ├── wishlistCount
    ├── toggleWishlist()
    └── removeFromWishlist()

🚀 Getting Started

Prerequisites

Make sure you have installed:

Node.js

npm

Git

1. Clone the repository

git clone https://github.com/your-username/flashsale.git

2. Open the project

cd flashsale

3. Install dependencies

npm install

4. Start the development server

npm run dev

Vite will display the local development URL in the terminal.

📦 Production Build

Build the application:

npm run build

Preview the production build:

npm run preview

🧪 Current Development Status

Frontend
████████████████████  100%

Backend
░░░░░░░░░░░░░░░░░░░░    0%

Database
░░░░░░░░░░░░░░░░░░░░    0%

API Integration
░░░░░░░░░░░░░░░░░░░░    0%

Completed

React project setup

Responsive customer UI

Authentication UI

Product browsing

Product details

Cart

Checkout

Orders

Wishlist

Profile

Customer route protection

Admin dashboard

Admin product management

Responsive layouts

Production build

Vercel deployment

Next

Spring Boot backend

MySQL database

User API

Product API

Cart API

Wishlist API

Order API

JWT authentication

Refresh tokens

Role-based authorization

React ↔ Spring Boot integration

Production deployment of backend

🔮 Future Enhancements

Planned improvements include:

Real-time inventory management

Product image upload

Advanced product filtering

Pagination

Search optimization

Payment gateway integration

Email notifications

Order cancellation and returns

Admin user management

Analytics dashboard

Cloud deployment

Automated testing

API documentation with Swagger/OpenAPI

💡 Why This Project?

FlashSale is designed as more than a basic CRUD project.

The project demonstrates practical software engineering concepts such as:

Component-based architecture

Reusable UI design

Client-side routing

Global state management

Protected application routes

E-commerce workflows

Admin workflows

REST API architecture

Authentication and authorization design

Database-driven application planning

Responsive frontend development

📸 Screenshots

Add screenshots of the following sections to make the GitHub repository more visual:

docs/
├── login.png
├── home.png
├── product-details.png
├── cart.png
├── checkout.png
├── orders.png
├── wishlist.png
├── admin-dashboard.png
└── admin-products.png

Then they can be displayed in this README.

🌐 Deployment

Frontend

The current frontend is deployed using Vercel.

Live Application:
https://flash-sale-gamma.vercel.app/login

Planned Deployment Architecture

                 ┌───────────────┐
                 │    Vercel     │
                 │ React Client  │
                 └───────┬───────┘
                         │
                       HTTPS
                         │
                         ▼
                 ┌───────────────┐
                 │ Spring Boot   │
                 │ REST API      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     MySQL     │
                 │   Database    │
                 └───────────────┘

👨‍💻 Author

Lokesh Kumar

Computer Science & Engineering Student
Aspiring Software Engineer | Full-Stack Java Developer

Core Skills

Java
Spring Boot
Spring Security
REST APIs
SQL
React
JavaScript
Tailwind CSS
Git & GitHub

⭐ Project

If you find FlashSale interesting, consider giving the repository a ⭐ on GitHub.

<p align="center">
  Built with ❤️ using React, JavaScript and Tailwind CSS
</p>
