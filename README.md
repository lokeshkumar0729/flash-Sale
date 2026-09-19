# ⚡ FlashSale

> A full-stack e-commerce platform built to simulate a modern production-style shopping system with secure authentication, role-based access, product management, orders, and scalable backend architecture.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2F21-ED8B00?logo=openjdk&logoColor=white)](https://www.java.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)]()

---

## 📌 Overview

FlashSale is a full-stack e-commerce application designed with a production-oriented architecture.

The project focuses not only on the shopping experience, but also on backend engineering concepts such as:

- Secure authentication and authorization
- Role-based access control
- RESTful API design
- Database relationships
- Transactional order processing
- Product and inventory management
- Scalable application architecture

The frontend provides the customer and admin experience, while the backend is being developed using Java and Spring Boot.

---

## ✨ Core Features

### 👤 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Secure password hashing
- Role-based authorization
- Protected customer routes
- Protected admin routes
- Refresh-token based authentication

### 🛍️ Customer

- Browse products
- Product details
- Search and filtering
- Add to cart
- Wishlist
- Checkout
- Address management
- Order placement
- Order history
- Order details
- Profile management

### 🛠️ Admin

- Admin dashboard
- Product management
- Order management
- User management
- Inventory management
- Analytics

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │   Customer / Admin   │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    ├──────────────────────┤
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    │ Security / JWT       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MySQL          │
                    │                      │
                    │ Users                │
                    │ Products             │
                    │ Orders               │
                    │ Order Items          │
                    │ Cart / Wishlist      │
                    └──────────────────────┘
