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
        console.log("========================");
        
        for(const orderData of order){
            console.log("Creating order for book:", orderData._id);
            const newOrder = new Order({user: id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();
            console.log("Order created:", orderDataFromDb._id);

            await User.findByIdAndUpdate(id, {$push: {orders: orderDataFromDb._id}});
            await User.findByIdAndUpdate(id, {$pull: {cart: orderData._id}});
            console.log("User updated with order and cart cleared");
        }
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
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: {path: "book"},
        });

        const orderData = userData.orders.reverse();
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