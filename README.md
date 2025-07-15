# BookHeaven - Full Stack Book Store Application

A modern, responsive book store application built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

### User Features
- **Authentication**: User registration and login with JWT tokens
- **Browse Books**: View all books and recently added books
- **Book Details**: Detailed view of individual books
- **Favorites**: Add/remove books to/from favorites
- **Shopping Cart**: Add books to cart and manage cart items
- **Order Management**: Place orders and view order history
- **Profile Management**: Update user information and address

### Admin Features
- **Book Management**: Add, edit, and delete books
- **Order Management**: View all orders and update order status
- **Admin Dashboard**: Dedicated admin interface

### General Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, dark-themed interface with smooth animations
- **Real-time Updates**: Dynamic content updates without page refresh

## Tech Stack

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=1000
```

4. Start the backend server:
```bash
npm start
# or for development with nodemon
npx nodemon app.js
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:1000`

## API Endpoints

### Authentication
- `POST /api/v1/signup` - User registration
- `POST /api/v1/login` - User login
- `GET /api/v1/get-user-information` - Get user details
- `PUT /api/v1/update-address` - Update user address

### Books
- `GET /api/v1/get-all-books` - Get all books
- `GET /api/v1/get-recent-books` - Get recently added books
- `GET /api/v1/get-book-by-id/:id` - Get book by ID
- `POST /api/v1/add-book` - Add new book (Admin only)
- `PUT /api/v1/update-book/:id` - Update book (Admin only)
- `DELETE /api/v1/delete-book` - Delete book (Admin only)

### Favorites
- `PUT /api/v1/add-book-to-favourite` - Add book to favorites
- `PUT /api/v1/remove-book-from-favourite` - Remove book from favorites
- `GET /api/v1/get-favourite-books` - Get user's favorite books

### Cart
- `PUT /api/v1/add-to-cart` - Add book to cart
- `PUT /api/v1/remove-from-cart/:bookId` - Remove book from cart
- `GET /api/v1/get-user-cart` - Get user's cart

### Orders
- `POST /api/v1/place-order` - Place new order
- `GET /api/v1/get-order-history` - Get user's order history
- `GET /api/v1/get-all-orders` - Get all orders (Admin only)
- `PUT /api/v1/update-status/:id` - Update order status (Admin only)

## Usage

### For Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Books**: Navigate to "All Books" to view the complete catalog
3. **Book Details**: Click on any book to view detailed information
4. **Add to Favorites**: Click the heart icon to add books to favorites
5. **Add to Cart**: Click the cart icon to add books to your shopping cart
6. **Place Orders**: Go to cart and place orders for selected books
7. **Manage Profile**: Update your information and view order history

### For Admins
1. **Login**: Use admin credentials to access admin features
2. **Add Books**: Use the "Add Book" section to add new books to the catalog
3. **Manage Orders**: View all orders and update their status
4. **Book Management**: Edit or delete existing books

## Project Structure

```
Book-store/
├── backend/
│   ├── app.js              # Main server file
│   ├── package.json        # Backend dependencies
│   ├── connection/
│   │   └── conn.js         # Database connection
│   ├── models/
│   │   ├── user.js         # User model
│   │   ├── books.js        # Book model
│   │   └── order.js        # Order model
│   └── routes/
│       ├── user.js         # User routes
│       ├── book.js         # Book routes
│       ├── favourite.js    # Favorite routes
│       ├── cart.js         # Cart routes
│       ├── order.js        # Order routes
│       └── userAuth.js     # Authentication middleware
├── frontend/
│   ├── src/
│   │   ├── api/            # API configuration
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact the development team.

---

**Happy Reading! 📚**
