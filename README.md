# THRUST — Contemporary Minimalist Clothing & Apparel

THRUST is a modern full-stack clothing shopping web application built with a bold, minimal, and clean design language. Engineered with **React 18 + Vite**, **Node.js + Express**, and **MongoDB with Mongoose**, THRUST delivers an end-to-end e-commerce experience for both shoppers and store administrators with Cash on Delivery (COD) fulfillment.

---

## 1. Project Overview & Features

- **Brand & Theme**: **THRUST** — Contemporary everyday apparel with clean architectural silhouettes, heavyweight natural cottons (280–440 GSM), and muted palettes.
- **Custom Colorway**: Watermelon (`#ed254e`), Royal Gold (`#f9dc5c`), Mint Cream (`#f4fffd`), Prussian Blue (`#011936`), and Charcoal Blue (`#465362`).
- **Complete Dark & Light Mode**: Seamless theme toggle across every single page.
- **Currency in Rupees (₹)**: All prices, subtotals, item multipliers, and order totals dynamically calculated in Indian Rupees (₹).
- **Extensive Catalog**: 40+ garments across 4 defined collections (at least 10 products each in Men, Women, Kids, and Accessories).
- **Search, Filter & Sort**: Real-time keyword search, category navigation, size and colour filters, price range sliders, and multi-mode sorting (Newest, Price Low-High, Price High-Low, Most Popular).
- **Interactive Product Showcase**: High-resolution image galleries, live MongoDB inventory tracking, size selector, colour picker, quantity calculator, and related garments.
- **Shopping Bag & Wishlist**: Real-time quantity increment/decrement, dynamic subtotal multiplier, and persistent database synchronization.
- **Cash on Delivery (COD) Checkout**: Verified, secure order placement without fake card processing. Atomically decrements product inventory in MongoDB upon order placement.
- **Live Order History & Cancellation**: View tracking statuses (`Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`). Orders in `Placed` or `Processing` can be cancelled by the customer, which immediately restores product stock in MongoDB.
- **Role-Based Protected Routes**: JWT authentication (bcryptjs password hashing), role separation (`customer` vs `admin`), and session recovery.
- **Admin Control Dashboard**:
  - Live store statistics (Gross Revenue, Total Orders, Active Catalog, Registered Users).
  - Full product CRUD (create with image URLs, sizes, colours, stock; update; delete).
  - Real-time order fulfillment manager (update status across lifecycle).
  - Registered customer directory.

---

## 2. Technology Stack

### Frontend (`client/`)
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (Centralized API client with base URL configuration and JWT Bearer interceptor)
- **Icons**: Lucide React
- **Design System**: Custom CSS Design Tokens (`index.css`), dual-theme responsive across desktop, tablet, and mobile screens.

### Backend (`server/`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ODM
- **Security**: Helmet, CORS origin control, bcryptjs password encryption, JWT (JSON Web Tokens)
- **Logging**: Morgan HTTP logger
- **Error Handling**: Centralized error middleware with standardized JSON responses.

---

## 3. Project Directory Structure

```text
.
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, ProtectedRoute
│   │   ├── context/            # ThemeContext, AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/              # Landing, Login, Register, Home, Shop, ProductDetail,
│   │   │                       # Cart, Checkout, Orders, Wishlist, Profile, Admin, 404
│   │   ├── services/           # Centralized Axios API client (api.js)
│   │   ├── App.jsx             # Router and Global Context Providers
│   │   ├── index.css           # THRUST Design System & dual-theme styling
│   │   └── main.jsx            # React root mount
│   ├── .env.example            # Frontend environment template
│   ├── index.html              # HTML shell with Google Fonts
│   ├── package.json            # Client dependencies and scripts
│   └── vite.config.js          # Vite configuration with API proxy
│
├── server/                     # Node.js + Express REST API Backend
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # auth, product, cart, wishlist, order, user, admin
│   ├── middleware/             # auth verification (protect, adminOnly) & error handler
│   ├── models/                 # Mongoose schemas: User, Product, Cart, Order
│   ├── routes/                 # Express REST routers (/api/...)
│   ├── app.js                  # Express app assembly & middleware
│   ├── package.json            # Server dependencies and scripts
│   ├── seed.js                 # Database seeder (40+ products in ₹ + Admin account)
│   ├── server.js               # Server entry point
│   ├── .env.example            # Backend environment template
│   └── .env                    # Local environment configuration
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Comprehensive technical documentation
```

---

## 4. Prerequisites

Before running the application, make sure you have the following installed:
1. **Node.js** (v18 or higher; tested on v24 LTS) and **npm**.
2. **MongoDB Community Server** (v6.0 or higher) installed locally and running as a service or via `mongod`.
3. **MongoDB Compass** (GUI for inspecting database collections).
4. **Git** (installed on Windows).

---

## 5. Environment Setup

### Backend (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```powershell
Copy-Item server\.env.example server\.env
```
Ensure the configuration values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/flexi_store
JWT_SECRET=thrust_jwt_super_secret_key_2026_production_grade
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@flexi.com
ADMIN_PASSWORD=AdminPass123!
```

### Frontend (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```powershell
Copy-Item client\.env.example client\.env
```
Contains:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 6. MongoDB Compass Setup

1. Launch **MongoDB Compass**.
2. In the connection string field, paste:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. Once the seed script is executed, you will observe the database named `flexi_store` with the following collections:
   - `users`
   - `products` (40+ products with pricing in ₹)
   - `carts`
   - `orders`

---

## 7. Installation & Seeding Steps

Open **Windows PowerShell** in the project root:

### 1. Install Backend Dependencies
```powershell
cd server
npm.cmd install
cd ..
```

### 2. Install Frontend Dependencies
```powershell
cd client
npm.cmd install
cd ..
```

### 3. Seed Database
Make sure MongoDB service is running, then run:
```powershell
cd server
npm.cmd run seed
cd ..
```
*The seed script populates 40+ garments across Men, Women, Kids, and Accessories in Indian Rupees (₹), creates the Administrator account (`admin@flexi.com` / `AdminPass123!`), creates a demo customer (`customer@flexi.com` / `CustomerPass123!`), and generates a baseline order.*

---

## 8. Running the Application

Use two separate Windows PowerShell windows:

### Terminal 1: Backend Server
```powershell
cd server
npm.cmd run dev
```
*Backend runs at:* `http://localhost:5000` (API endpoint: `http://localhost:5000/api`)

### Terminal 2: Frontend Client
```powershell
cd client
npm.cmd run dev
```
*Frontend runs at:* `http://localhost:5173`

Open your browser and navigate to: **`http://localhost:5173`**

---

## 9. API Endpoints Reference (`/api`)

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/products` | Public | Query garments with search, category, size, colour, price range, sort & pagination |
| `GET` | `/api/products/:id` | Public | Get product details and related category garments |
| `POST` | `/api/products` | Admin | Create a new garment in catalog |
| `PUT` | `/api/products/:id` | Admin | Update garment details and stock |
| `DELETE` | `/api/products/:id` | Admin | Remove product from store |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/cart` | Private | Retrieve user's cart populated with product data |
| `POST` | `/api/cart` | Private | Add item (product, size, colour, quantity) |
| `PUT` | `/api/cart/:itemId` | Private | Update item quantity in bag |
| `DELETE` | `/api/cart/:itemId` | Private | Remove item from bag |
| `DELETE` | `/api/cart` | Private | Clear entire shopping bag |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/wishlist` | Private | Get user's saved items |
| `POST` | `/api/wishlist/:productId` | Private | Add garment to wishlist |
| `DELETE` | `/api/wishlist/:productId` | Private | Remove garment from wishlist |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/orders` | Private | Checkout with Cash on Delivery & atomic stock decrement |
| `GET` | `/api/orders` | Private | Get authenticated user's order history |
| `GET` | `/api/orders/:id` | Private | View specific order details |
| `PUT` | `/api/orders/:id/cancel` | Private | Cancel order and automatically restore stock |
| `GET` | `/api/orders/admin/all` | Admin | Retrieve all customer orders with filtering |
| `PUT` | `/api/orders/:id/status` | Admin | Update fulfillment status (Placed, Processing, Shipped, Delivered, Cancelled) |

### Users & Profile (`/api/users`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `PUT` | `/api/users/profile` | Private | Update name, phone, and saved shipping addresses |
| `PUT` | `/api/users/password` | Private | Change password with verification |
| `GET` | `/api/users` | Admin | List all registered store accounts |

### Admin Dashboard (`/api/admin`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/admin/stats` | Admin | Aggregate revenue, orders count, catalog count, user count |
