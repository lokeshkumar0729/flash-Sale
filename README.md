# ⚡ FlashSale

> A full-stack e-commerce platform built with React, Spring Boot, Java, and MySQL, focused on secure authentication, role-based access, product management, orders, and production-oriented backend architecture.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot\&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2F21-ED8B00?logo=openjdk\&logoColor=white)](https://www.java.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql\&logoColor=white)](https://www.mysql.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)]()

---

## 🌐 Live Demo

**Frontend:** [FlashSale](https://flash-sale-gamma.vercel.app/login)

> The frontend is deployed on Vercel. Backend integration is currently under development.

---
## 📌 Overview

FlashSale is a full-stack e-commerce application designed around a modern customer shopping experience and a production-oriented backend architecture.

The project covers real-world application concepts including:

* Secure authentication and authorization
* Role-based access control
* RESTful API design
* Relational database design
* Product and inventory management
* Cart and wishlist management
* Order processing
* Customer and admin workflows

The frontend is implemented with React, while the backend is currently being developed using Java and Spring Boot.

---

## ✨ Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure password hashing
* Role-based authorization
* Protected customer routes
* Protected admin routes
* Refresh-token support

### 🛍️ Customer

* Product browsing
* Product details
* Search and filtering
* Shopping cart
* Wishlist
* Checkout
* Address management
* Order placement
* Order history
* Order details
* Profile management

### 🛠️ Admin

* Admin dashboard
* Product management
* Order management
* User management
* Inventory management
* Analytics

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
                    │        MySQL         │
                    ├──────────────────────┤
                    │ Users                │
                    │ Products             │
                    │ Orders               │
                    │ Order Items          │
                    │ Cart / Wishlist      │
                    └──────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend

* React
* React Router
* Context API
* Tailwind CSS
* Axios
* Responsive UI

### Backend

* Java 17 / 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* JWT

### Database

* MySQL

### Development Tools

* Git & GitHub
* Postman
* IntelliJ IDEA
* VS Code

---

## 🔐 Security

Security is a core part of FlashSale's backend architecture.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Authentication
 │
 ▼
JWT Access Token
 │
 ▼
Spring Security
 │
 ├── CUSTOMER
 │
 └── ADMIN
 │
 ▼
Protected REST APIs
```

Security considerations include:

* BCrypt password hashing
* JWT authentication
* Role-based authorization
* Protected API endpoints
* Token validation
* Refresh-token mechanism
* Server-side validation

---

## 📂 Project Structure

### Frontend

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    │   ├── auth/
    │   ├── customer/
    │   └── admin/
    ├── context/
    ├── routes/
    ├── services/
    ├── assets/
    └── App.jsx
```

### Backend

```text
backend/
└── src/
    └── main/
        ├── java/
        │   └── com.flashsale/
        │       ├── controller/
        │       ├── service/
        │       ├── repository/
        │       ├── entity/
        │       ├── dto/
        │       ├── security/
        │       ├── exception/
        │       └── config/
        │
        └── resources/
            ├── application.properties
            └── ...
```

---

## 🔄 Application Flow

### Customer

```text
Register / Login
       ↓
Authentication
       ↓
Browse Products
       ↓
Product Details
       ↓
Cart / Wishlist
       ↓
Checkout
       ↓
Place Order
       ↓
Order History
```

### Admin

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Products ─── Orders ─── Users
     │
     └── Inventory / Analytics
```

---

## 🗄️ Database

FlashSale uses a relational database model centered around the application's core e-commerce entities.

```text
Users
  │
  ├── Orders
  │     │
  │     └── Order Items
  │              │
  │              └── Products
  │
  ├── Cart
  │
  └── Wishlist
```

The database schema and relationships will continue to evolve as the backend implementation progresses.

---

## 🚧 Development Status

| Module                | Status            |
| --------------------- | ----------------- |
| Frontend Architecture | ✅ Completed       |
| Customer UI           | ✅ Completed       |
| Admin UI              | ✅ Completed       |
| Cart & Wishlist       | ✅ Completed       |
| Checkout Flow         | ✅ Completed       |
| Spring Boot Backend   | 🚧 In Development |
| Authentication API    | 🚧 In Development |
| Database Integration  | 🚧 In Development |
| Product APIs          | ⏳ Planned         |
| Cart APIs             | ⏳ Planned         |
| Order APIs            | ⏳ Planned         |
| Admin APIs            | ⏳ Planned         |
| Testing               | ⏳ Planned         |
| Production Deployment | ⏳ Planned         |

---

## 📸 Application Preview

Screenshots and feature demonstrations will be added as the application reaches stable milestones.

### Customer Experience

*Coming soon*

### Admin Dashboard

*Coming soon*

### Backend API

*Coming soon*

---

## 🛣️ Roadmap

* [x] Frontend architecture
* [x] Customer UI
* [x] Admin UI
* [x] Cart & Wishlist
* [x] Checkout flow
* [ ] Spring Boot backend
* [ ] JWT authentication
* [ ] Database integration
* [ ] Product APIs
* [ ] Order management APIs
* [ ] Admin APIs
* [ ] API validation & exception handling
* [ ] Testing
* [ ] Production deployment
* [ ] Performance improvements

---

## 🎯 Project Goals

FlashSale is being developed as a practical full-stack project to explore how a modern e-commerce application is designed beyond the UI layer.

The primary focus is on:

* Clean architecture
* Maintainable code
* Secure APIs
* Database design
* Authentication & authorization
* Real-world business logic
* Scalable application structure

---

## 👨‍💻 Author

**Lokesh Kumar**

[GitHub](https://github.com/lokeshkumar0729) · [LinkedIn](https://www.linkedin.com/in/lokesh-kumar0729/) · [LeetCode](https://leetcode.com/u/Lokesh_229/)

---

⭐ If you find this project interesting, consider starring the repository.
