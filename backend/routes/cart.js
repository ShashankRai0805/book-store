const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

router.put("/add-to-cart", authenticateToken, async (req, res)=>{
    try {
        const {bookid} = req.headers;
        const {id} = req.headers;
        
        console.log("=== ADD TO CART DEBUG ===");
        console.log("User ID:", id);
        console.log("Book ID:", bookid);
        console.log("Headers:", req.headers);
        console.log("========================");
        
        if (!id) {
            console.log("ERROR: No user ID provided");
            return res.status(400).json({
                msg: "User ID is required"
            });
        }
        
        if (!bookid) {
            console.log("ERROR: No book ID provided");
            return res.status(400).json({
                msg: "Book ID is required"
            });
        }
        
        const userData = await User.findById(id);
        if (!userData) {
            console.log("ERROR: User not found");
            return res.status(404).json({
                msg: "User not found"
            });
        }
        
        console.log("User found:", userData.username);
        console.log("Current cart:", userData.cart);
        
        const isBookInCart = userData.cart.map(id => id.toString()).includes(bookid.toString());
        console.log("Is book in cart:", isBookInCart);
        
        if(isBookInCart){
            return res.status(200).json({
                msg: "Book is already in Cart"
            });
        }

        await User.findByIdAndUpdate(id, {$push: {cart: bookid}});
        console.log("Book added to cart successfully");
        
        return res.status(200).json({
            msg: "Book added to cart"
        });
    } catch (error) {
        console.log("Add to cart error:", error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

router.put("/remove-from-cart/:bookId", authenticateToken, async (req, res)=>{
    try {
        const {bookId} = req.params;
        const {id} = req.headers;
        
        console.log("Remove from cart - User ID:", id, "Book ID:", bookId);
        
        await User.findByIdAndUpdate(id, {$pull: {cart: bookId}});
        
        return res.status(200).json({
            msg: "Book removed from cart"
        });
    } catch (error) {
        console.log("Remove from cart error:", error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

router.get("/get-user-cart", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        
        console.log("Get user cart - User ID:", id);
        
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();

        return res.status(200).json({
            status: "Success",
            data: cart
        });
    } catch (error) {
        console.log("Get user cart error:", error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

module.exports = router;