# 🎨 KalaSetu — Indian Artisan Platform

KalaSetu is a **full-stack MERN application** that connects Indian artisans with buyers through a modern digital marketplace.
It supports **product sales, community interaction, event management, and order tracking**.

---

## 🚀 Tech Stack

### 🖥️ Frontend

* React (Vite)
* Context API (Auth + Cart)
* Axios
* React Router
* Tailwind / Custom CSS

### ⚙️ Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (file upload)

---

## 📁 Project Structure

---

### 🔙 Backend (Node.js + Express)

```
backend/
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Review.js
│   ├── Post.js
│   ├── Comment.js
│   └── Event.js
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── reviewController.js
│   ├── postController.js
│   ├── commentController.js
│   ├── eventController.js
│   └── adminController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── reviewRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   ├── eventRoutes.js
│   └── adminRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
│
├── utils/
│   ├── generateToken.js
│   ├── sendResponse.js
│   └── seeder.js
│
├── uploads/
│
├── server.js
├── .env
├── package.json
└── .gitignore
```

---

### 🎨 Frontend (React + Vite)

```
frontend/
│
├── src/
│
├── api/
│   ├── axios.js
│   ├── authApi.js
│   ├── productApi.js
│   ├── orderApi.js
│   ├── cartApi.js
│   ├── reviewApi.js
│   ├── communityApi.js
│   ├── eventApi.js
│   └── adminApi.js
│
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ReviewCard.jsx
│   ├── OrderStatusBadge.jsx
│   ├── ProtectedRoute.jsx
│   ├── Loader.jsx
│   ├── StarRating.jsx
│   └── FilterBar.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── Community.jsx
│   └── Events.jsx
│
├── artisan/
│   ├── ArtisanDashboard.jsx
│   ├── ManageProducts.jsx
│   ├── ManageOrders.jsx
│   └── CreateEvent.jsx
│
├── admin/
│   ├── AdminDashboard.jsx
│   ├── ManageUsers.jsx
│   ├── ManageProducts.jsx
│   └── ManagePosts.jsx
│
├── hooks/
│   ├── useAuth.js
│   └── useCart.js
│
├── styles/
│   ├── index.css
│   └── theme.css
│
├── App.jsx
├── main.jsx
├── .env
├── vite.config.js
└── package.json
```

---

## 🔑 Features

### 👤 Authentication

* JWT-based login & register
* Role-based access (Buyer / Artisan / Admin)

### 🛍️ Products

* Add / update / delete products
* Product listing with filters
* Reviews & ratings

### 🛒 Cart System

* Add to cart
* Update quantity
* Remove items
* Auto price calculation (fixed NaN issue)

### 📦 Orders

* Place order
* Order history
* Order status updates
* Artisan sees only their product orders

### 🎪 Events

* Create events (artisan)
* View all events
* Register for events

### 💬 Community

* Posts & comments
* Interaction system

### 🛠️ Admin Panel

* Manage users
* Manage products
* Moderate posts

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/kalasetu.git
cd kalasetu
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Base URL

```
http://localhost:5000/api
```

---

## 🧪 Sample Roles

| Role    | Access                          |
| ------- | ------------------------------- |
| Buyer   | Shop, Cart, Orders              |
| Artisan | Manage products, orders, events |
| Admin   | Full control                    |

---

## 🔥 Key Improvements Done

* ✅ Fixed cart ₹NaN issue
* ✅ Fixed order validation errors
* ✅ Added artisan-specific order filtering
* ✅ Added event creation system
* ✅ Fixed JWT token handling
* ✅ Improved API response consistency

---

## 🚀 Future Enhancements

* 💳 Payment gateway integration (Stripe/Razorpay)
* 📊 Analytics dashboard
* 🔔 Notifications system
* 📱 Mobile responsiveness improvement
* 🤖 AI-based recommendations

---

## 👨‍💻 Author

**KalaSetu Team**
Made with ❤️ for Indian Artisans 🇮🇳

---

## 📜 License

This project is for educational & project purposes.
