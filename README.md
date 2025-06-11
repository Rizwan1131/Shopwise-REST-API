# 🛒 Shopwise REST API

A comprehensive, full-featured e-commerce REST API built with Node.js, Express.js, and MongoDB. This robust backend solution provides all the essential functionality needed for modern e-commerce applications, including user authentication, product management, shopping cart operations, order processing, and more.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with email verification
- **JWT-based Authentication** with multiple token sources (cookies, headers)
- **Role-based Access Control** (Admin/User permissions)
- **Secure Password Hashing** using bcrypt
- **Email Verification System** with automated emails

### 👥 User Management
- User registration and login
- Email verification workflow
- Role-based permissions (Admin/User)
- User profile management

### 📦 Product Management
- **CRUD Operations** for products (Admin only)
- **Image Upload** integration with Cloudinary
- **Product Search** functionality with keyword matching
- **Category-based Organization**
- **Stock Management**
- **Product Filtering** and retrieval

### 🗂️ Category Management
- Create, read, update, and delete categories
- Organize products by categories
- Admin-only category management

### 🛍️ Shopping Cart
- **Add/Remove Items** from cart
- **Update Item Quantities**
- **Persistent Cart Storage** per user
- **Cart Total Calculations**

### 📍 Address Management
- **Multiple Address Support** per user
- **CRUD Operations** for addresses
- **Address Validation**
- Integration with order system

### 📋 Order Management
- **Place Orders** from cart items
- **Order Status Tracking** (placed, shipped, delivered)
- **Order History** for users
- **Admin Order Management**
- **Automatic Cart Clearing** after order placement

### 🔧 Additional Features
- **File Upload Support** with Cloudinary integration
- **Error Handling** with custom error responses
- **Input Validation** and sanitization
- **CORS Support** for cross-origin requests
- **Environment Configuration** with dotenv

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **File Storage:** Cloudinary
- **Email Service:** Nodemailer
- **File Upload:** express-fileupload

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rizwan1131/Shopwise-REST-API.git
   cd Shopwise-REST-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration
   MAIL_ID=your_email@gmail.com
   MAIL_PASS=your_email_password
   
   # Cloudinary Configuration
   CLOUDE_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   
   # Server Configuration
   PORT=4000
   BASE_URL=http://localhost:4000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| GET | `/auth/verify/:token` | Verify email address | Public |
| POST | `/auth/login` | User login | Public |

### Product Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/product/create` | Create new product | Admin |
| GET | `/product/` | Get all products | Public |
| GET | `/product/get/:id` | Get product by ID | Public |
| GET | `/product/search?keyword=term` | Search products | Public |
| POST | `/product/update/:id` | Update product | Admin |
| DELETE | `/product/delete/:id` | Delete product | Admin |

### Category Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/category/create` | Create category | Admin |
| GET | `/category/` | Get all categories | Auth |
| GET | `/category/:id` | Get category by ID | Auth |
| PUT | `/category/:id` | Update category | Admin |
| DELETE | `/category/:id` | Delete category | Admin |

### Cart Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/cart/create` | Create empty cart | Auth |
| POST | `/cart/add` | Add item to cart | Auth |
| PUT | `/cart/update` | Update item quantity | Auth |
| DELETE | `/cart/remove/:productId` | Remove item from cart | Auth |
| GET | `/cart/mycart` | Get user's cart | Auth |

### Address Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/adress/add` | Add new address | Auth |
| POST | `/adress/update/:id` | Update address | Auth |
| POST | `/adress/delete/:id` | Delete address | Auth |

### Order Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/order/place-order` | Place new order | Auth |
| GET | `/order/myorder` | Get user orders | Auth |
| GET | `/order/get-all-order` | Get all orders | Admin |
| PUT | `/order/update/:orderId` | Update order status | Admin |

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in your requests using one of these methods:

1. **Cookie** (automatically set on login)
2. **Authorization Header:**
   ```
   Authorization: Bearer your_jwt_token
   ```
3. **Custom Header:**
   ```
   x-access-token: your_jwt_token
   ```

## 📝 Request/Response Examples

### User Registration
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

### Create Product (Admin)
```bash
POST /api/v1/product/create
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone model",
  "price": 999,
  "stock": 50,
  "category": "category_id",
  "imageFile": [file]
}
```

### Add to Cart
```bash
POST /api/v1/cart/add
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}
```

## 🗂️ Project Structure

```
Shopwise-REST-API/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── db.js                  # Database connection
├── controllers/
│   ├── user.controller.js     # User authentication logic
│   ├── product.controller.js  # Product management
│   ├── category.controller.js # Category management
│   ├── cart.controller.js     # Shopping cart operations
│   ├── order.controller.js    # Order processing
│   └── address.controller.js  # Address management
├── middlewares/
│   └── auth.middleware.js     # Authentication & authorization
├── models/
│   ├── User.Model.js          # User schema
│   ├── Product.Model.js       # Product schema
│   ├── Category.model.js      # Category schema
│   ├── Cart.Model.js          # Cart schema
│   ├── Order.model.js         # Order schema
│   └── Address.model.js       # Address schema
├── routes/
│   ├── user.routes.js         # User routes
│   ├── product.route.js       # Product routes
│   ├── category.routes.js     # Category routes
│   ├── cart.routes.js         # Cart routes
│   ├── order.routes.js        # Order routes
│   └── address.routes.js      # Address routes
├── utils/
│   ├── sendError.js           # Error response utility
│   ├── sendRes.js             # Success response utility
│   ├── sendMail.js            # Email utility
│   └── uploadFile.js          # File upload utility
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
└── index.js                   # Application entry point
```

## 🔒 Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Role-based Access Control:** Different permissions for admin and users
- **Input Validation:** Request data validation and sanitization
- **Environment Variables:** Sensitive data stored in environment variables
- **CORS Configuration:** Cross-origin resource sharing setup

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB database (local or cloud)
2. Configure Cloudinary account for image storage
3. Set up email service (Gmail recommended)
4. Update environment variables for production

### Production Considerations
- Use a process manager like PM2
- Set up reverse proxy with Nginx
- Enable HTTPS with SSL certificates
- Configure proper CORS settings
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Contact

**Rizwan** - [GitHub Profile](https://github.com/Rizwan1131)

Project Link: [https://github.com/Rizwan1131/Shopwise-REST-API](https://github.com/Rizwan1131/Shopwise-REST-API)

---

⭐ **Star this repository if you found it helpful!**
