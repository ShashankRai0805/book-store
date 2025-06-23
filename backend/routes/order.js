const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/books")
const {authenticateToken} = require("./userAuth")

router.post("/place-order", authenticateToken, async (req, res)=>{
    try {
        const id = req.headers.id;
        const order = req.body
        for(const orderData of order){
            const newOrder = new order({user: id, books: orderData._id});
            const orderDataFromDb = await newOrder.save();

            await User.findByIdAndUpdate(id, {$push: {orders: orderDataFromDb._id}})

            await User.findByIdAndUpdate(id, {$pull: {cart: orderData._id}})
        }
        return res.json({
            status: "success",
            msg: "Order Placed Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

router.get("/get-order-history", authenticateToken, async (req, res)=>{
    try {
        const id = req.headers
    const userData = await User.findById(id).populate({
        path: "orders",
        populate: {path: "book"},
    })


    const orderData = userData.orders.reverse();
    return res.json({
        status: "Success",
        data: orderData
    })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server Error"
        })
    }
})

router.get("/get-all-orders", authenticateToken, async (req, res)=>{
    try {
        const userData = await User.find().populate({
            path: "book"
        }).populate({
            path: "user"
        }).sort({
            createdAt: -1
        })

        return res.json({
            status: "Success",
            data: userData
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

router.put("/update-status/:id", authenticateToken, async (req, res)=>{
    try {
        const id = req.params
        await Order.findByIdAndUpdate(id, {status: req.body.status})
        return res.json({
            status: "Success",
            msg: "Status Updated Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

module.exports = router