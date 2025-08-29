const express = require("express")
const cors = require("cors")
require("dotenv").config();

// Import the database connection
require("../../backend/connection/conn");

// Import routes
const user = require("../../backend/routes/user")
const Books = require("../../backend/routes/book")
const Favourite = require("../../backend/routes/favourite")
const Cart = require("../../backend/routes/cart")
const Orders = require("../../backend/routes/order")

const app = express();

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    console.log("Headers:", req.headers);
    next();
});

// Mount routes at /api/v1
app.use("/api/v1", user)
app.use("/api/v1", Books)
app.use("/api/v1", Favourite)
app.use("/api/v1", Cart)
app.use("/api/v1", Orders)

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        env: {
            mongoUri: !!process.env.MONGO_URI,
            jwtSecret: !!process.env.JWT_SECRET,
            port: process.env.PORT
        }
    });
});

// Debug endpoint to check environment
app.get('/api/debug', (req, res) => {
    res.json({
        env: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        port: process.env.PORT
    });
});

// Export the handler function for Vercel
module.exports = (req, res) => {
    // Ensure the path starts with /api/v1 for the routes to match
    if (!req.url.startsWith('/api/v1')) {
        req.url = '/api/v1' + req.url;
    }
    
    return app(req, res);
};
