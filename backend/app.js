const express = require("express")
const cors = require("cors")
const app = express();
require("dotenv").config();
require("./connection/conn");
const user = require("./routes/user")
const Books = require("./routes/book")
const Favourite = require("./routes/favourite")
const Cart = require("./routes/cart")
const Orders = require("./routes/order")

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    console.log("Headers:", req.headers);
    next();
});

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

// For Vercel serverless functions
if (process.env.VERCEL) {
    module.exports = app;
} else {
    // For local development
    const PORT = process.env.PORT || 1000;
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
}