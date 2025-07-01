# Erick Tech Shop 🛒

A functional **E-Commerce MVP** built with **Node.js, Express, and Vanilla JavaScript**, featuring admin product management, shopping cart, order placement, and role-based access.

---

## 🔥 Features

### 👨‍💻 User Authentication
- Register / Login using username and password
- JWT-based token authentication
- Admin vs regular user roles

### 🛍️ Product Management
- Admins can add, edit, delete products
- Product details: name, price, image, description, category
- Dynamic product listing

### 🛒 Shopping Cart & Checkout
- Add to cart (Jumia-style UI)
- View cart items & total
- Remove items
- Place orders with checkout

### 📦 Order Management
- Users can view their own order history
- Admins can view **all** orders in the system

### 🔎 Search & Filter
- Live search by product name
- Filter products by category

---

## 📁 Project Structure

📦 Erick-Tech-Shop/
├── public/
│ ├── dashboard.html
│ ├── login.html
│ ├── register.html
│ └── css/
│ └── styles.css
├── routes/
│ └── auth.js
├── middleware/
│ └── authMiddleware.js
├── db.json
├── server.js
└── README.md

yaml
Copy
Edit

---

## 🚀 How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/erick-tech-shop.git
   cd erick-tech-shop
Install dependencies

bash
Copy
Edit
npm install
Run the server

bash
Copy
Edit
node server.js
Open in browser

arduino
Copy
Edit
http://localhost:3000
📦 Tech Stack
Backend: Node.js + Express

Frontend: Vanilla JavaScript + HTML/CSS

Auth: JWT (JSON Web Token)

Data: Flat-file JSON (db.json)

📚 Lessons Learned
Built RESTful APIs from scratch

Managed role-based access control

Worked with localStorage & JSON data persistence

Developed dynamic UI interactions

Created an end-to-end shopping experience MVP

📌 Next Steps
Switch to database (MongoDB or PostgreSQL)

Integrate payments (e.g., M-Pesa, PayPal)

Real-time order tracking

Responsive mobile-first frontend

Full deployment & production setup

👤 Author
Erick Njoroge
Certified Full-Stack Developer
📫 ericdavid348@gmail.com
🌐 My Portfolio
🔗 LinkedIn

⭐ Show Your Support
If you like this project, please ⭐ it and share with your network!

