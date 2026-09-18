⚡ FlashSale

A modern, responsive e-commerce frontend built with React + Vite, featuring customer shopping flows and an admin product management dashboard.

🌐 Live Demo: https://flash-sale-gamma.vercel.app/login

Frontend is complete. Spring Boot + MySQL backend integration is the next phase.

✨ Features

Customer

🔐 Login & Signup

🏠 Responsive home page

🔎 Product search & categories

📦 Product details

🛒 Cart & quantity management

❤️ Wishlist

💳 Checkout & payment UI

📍 Delivery address

✅ Order placement

📋 Order history & details

🚚 Order status tracking

👤 Profile & logout

🔒 Protected routes

Admin

📊 Dashboard with statistics & charts

📦 Product management

➕ Add products

✏️ Edit products

🗑️ Delete products

🔎 Search & category filtering

📱 Responsive admin UI

🧰 Tech Stack

Technology

Usage

React

Frontend UI

Vite

Build tool

JavaScript

Application logic

React Router

Routing

Context API

Global state

Tailwind CSS

Styling & responsive UI

Axios

API communication

Lucide React

Icons

Recharts

Admin charts

Vercel

Frontend deployment

Planned Backend

Java 21 · Spring Boot · Spring Security · JWT · BCrypt · Spring Data JPA · Hibernate · MySQL · REST APIs

📁 Project Structure

flashsale/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order/
│   │   └── admin/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   │   ├── auth/
│   │   ├── customer/
│   │   └── admin/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md

🧭 Main Routes

Customer

/login · /signup · /home · /products/:productId · /cart · /checkout · /orders · /orders/:orderId · /wishlist · /profile

Admin

/admin · /admin/products

🔄 Shopping Flow

Login → Home → Product → Cart → Checkout → Order
                                      ↓
                              Order History

🧠 State Management

FlashSale uses React Context API for shared application state:

AuthContext     → Authentication & user
CartContext     → Cart & pricing
WishlistContext → Wishlist
OrderContext    → Orders

🔐 Security

Current Frontend

Protected customer routes

Authentication state through Context API

Planned Backend

Spring Security
      ↓
JWT Authentication
      ↓
BCrypt Password Hashing
      ↓
Role-Based Access
      ↓
CUSTOMER / ADMIN

🚀 Run Locally

Requirements

Node.js

npm

Git

Installation

git clone https://github.com/your-username/flashsale.git
cd flashsale
npm install
npm run dev

Production Build

npm run build
npm run preview

📌 Project Status

Module                               Status
         
React Frontend                      ✅ Complete

Customer Features                   ✅ Complete

Admin Dashboard                     ✅ Complete

Product Management                  ✅ Complete

Responsive UI                       ✅ Complete

Vercel Deployment                   ✅ Live

Spring Boot Backend                🔜 Planned

MySQL Database                     🔜 Planned

JWT Authentication                 🔜 Planned

API Integration                    🔜 Planned

👨‍💻 Author

Lokesh Kumar
Computer Science & Engineering Student · Aspiring Software Engineer / Full-Stack Java Developer

Skills: Java · Spring Boot · Spring Security · REST APIs · SQL · React · JavaScript · Tailwind CSS

⭐ If you find the project useful, consider starring the repository.
