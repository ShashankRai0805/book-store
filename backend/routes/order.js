const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/books");
const Order = require("../models/order");
const {authenticateToken} = require("./userAuth");

router.post("/place-order", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const {order} = req.body;
        
        console.log("=== PLACE ORDER DEBUG ===");
        console.log("User ID:", id);
        console.log("Order data:", order);
        
        if (!id) {
            console.log("ERROR: No user ID provided");
            return res.status(400).json({
                msg: "User ID is required"
            });
        }
        
        if (!order || order.length === 0) {
            console.log("ERROR: No order data provided");
            return res.status(400).json({
                msg: "Order data is required"
            });
        }
        
        const createdOrders = [];
        
        for(const orderData of order){
            console.log("Creating order for book:", orderData._id);
            
            if (!orderData._id) {
                console.log("ERROR: Book ID missing in order data");
                continue;
            }
            
            const newOrder = new Order({user: id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();
            console.log("Order created with ID:", orderDataFromDb._id);
            createdOrders.push(orderDataFromDb._id);

            const userUpdate = await User.findByIdAndUpdate(id, {$push: {orders: orderDataFromDb._id}}, {new: true});
            console.log("User orders array after update:", userUpdate.orders);
            
            await User.findByIdAndUpdate(id, {$pull: {cart: orderData._id}});
            console.log("Book removed from cart:", orderData._id);
        }
        
        console.log("Total orders created:", createdOrders.length);
        console.log("========================");
        
        return res.json({
            status: "success",
            msg: "Order Placed Successfully"
        });
    } catch (error) {
        console.log("Place order error:", error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

router.get("/get-order-history", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        console.log("=== GET ORDER HISTORY DEBUG ===");
        console.log("User ID from headers:", id);
        
        if (!id) {
            console.log("ERROR: No user ID in headers");
            return res.status(400).json({
                msg: "User ID is required"
            });
        }
        
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: {path: "book"},
        });
        
        if (!userData) {
            console.log("ERROR: User not found");
            return res.status(404).json({
                msg: "User not found"
            });
        }
        
        console.log("User found:", userData.username);
        console.log("User orders array:", userData.orders);
        console.log("Number of orders:", userData.orders?.length || 0);
        
        if (userData.orders && userData.orders.length > 0) {
            console.log("Sample order:", userData.orders[0]);
        }

        const orderData = userData.orders ? userData.orders.reverse() : [];
        console.log("Final order data being sent:", orderData);
        console.log("Order data length:", orderData.length);
        console.log("================================");
        
        return res.json({
            status: "Success",
            data: orderData
        });
    } catch (error) {
        console.log("Get order history error:", error);
        return res.status(500).json({
            msg: "Internal server Error"
        });
    }
});

// Debug route to check user's current orders array
router.get("/debug-user-orders", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        console.log("=== DEBUG USER ORDERS ===");
        
        const userData = await User.findById(id);
        console.log("User:", userData.username);
        console.log("Orders array:", userData.orders);
        console.log("Orders count:", userData.orders.length);
        
        // Also check all orders in the database for this user
        const allOrders = await Order.find({user: id}).populate('book');
        console.log("All orders in database for this user:", allOrders.length);
        allOrders.forEach((order, index) => {
            console.log(`Order ${index + 1}:`, {
                id: order._id,
                book: order.book?.title,
                status: order.status,
                createdAt: order.createdAt
            });
        });
        
        return res.json({
            user: userData.username,
            ordersInUserArray: userData.orders,
            allOrdersInDB: allOrders
        });
    } catch (error) {
        console.log("Debug user orders error:", error);
        return res.status(500).json({msg: "Error"});
    }
});

router.get("/get-order-history/:userId", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const {userId} = req.params;
        
        console.log("=== GET USER ORDER HISTORY ===");
        console.log("Admin ID:", id);
        console.log("Target User ID:", userId);
        
        const user = await User.findById(id);
        console.log("Admin user:", user?.username, "Role:", user?.role);
        
        if (user.role !== "admin") {
            console.log("Access denied - not admin");
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }
        
        const userData = await User.findById(userId).populate({
            path: "orders",
            populate: {path: "book"},
        });
        
        console.log("Target user found:", userData?.username);
        console.log("Orders count:", userData?.orders?.length || 0);
        console.log("Orders data:", userData?.orders);

        const orderData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data: orderData
        });
    } catch (error) {
        console.log("Get user order history error:", error);
        return res.status(500).json({
            msg: "Internal server Error"
        });
    }
});

router.get("/get-all-orders", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const user = await User.findById(id);
        
        if (user.role !== "admin") {
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }
        
        const orders = await Order.find()
            .populate("book")
            .populate("user")
            .sort({ createdAt: -1 });

        return res.json({
            status: "Success",
            data: orders
        });
    } catch (error) {
        console.log("Get all orders error:", error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

router.put("/update-status/:id", authenticateToken, async (req, res)=>{
    try {
        const {id: orderId} = req.params;
        const {id: userId} = req.headers;
        
        const user = await User.findById(userId);
        if (user.role !== "admin") {
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }
        
        await Order.findByIdAndUpdate(orderId, {status: req.body.status});
        return res.json({
            status: "Success",
            msg: "Status Updated Successfully"
        });
    } catch (error) {
        console.log("Update status error:", error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

module.exports = router;