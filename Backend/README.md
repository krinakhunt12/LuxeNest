# LuxeNest Backend API

Premium furniture e-commerce backend built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with advanced filtering
- **Order Management**: Complete order lifecycle management
- **Payment Integration**: Secure payment processing
- **Reviews & Ratings**: User reviews with moderation
- **Admin Dashboard**: Comprehensive admin APIs
- **Search**: Full-text search with suggestions
- **Caching**: Redis integration for performance
- **Security**: Rate limiting, input validation, XSS protection

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/      # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── validators/      # Input validators
├── server.js            # Entry point
├── package.json
└── .env.example
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secrets
   - Cloudinary credentials (for image uploads)
   - Email service credentials
   - Payment gateway credentials

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-sellers` - Get best sellers
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add/:productId` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- `POST /api/wishlist/move-to-cart/:productId` - Move to cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:orderId/status` - Get payment status

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders

### Search
- `GET /api/search` - Search products
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/trending` - Get trending searches

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **multer**: File uploads
- **cloudinary**: Image storage
- **nodemailer**: Email service
- **redis**: Caching (optional)

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Update MongoDB connection to production URI
3. Configure all environment variables
4. Use process manager like PM2:
```bash
pm2 start server.js --name luxenest-api
```

## 📄 License

ISC

