const router = require("express").Router();
const User = require("../models/user")
const {authenticateToken} = require("./userAuth");

router.put("/add-to-cart", authenticateToken, async (req, res)=>{
    try {
        const bookId = req.headers.bookid
        const id = req.headers.id
        const userData = await User.findById(id)
        const isBookInCart = userData.cart.includes(bookId)
        if(isBookInCart){
            return res.status(200).json({
                msg: "Book is already in Cart"
            })
        }

        await User.findByIdAndUpdate(id, {$push: {cart: bookId}})
        return res.status(200).json({
            msg: "Book added to cart"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

router.put("/remove-from-cart/:bookId", authenticateToken, async (req, res)=>{
    try {
        const bookId = req.params
    const id = req.headers.id
    await User.findByIdAndUpdate(id, {$pull: {cart: bookId}})
    
    return res.status(200).json({
        msg: "Book removed from cart"
    })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
})

router.get("/get-user-cart", authenticateToken, async (req, res)=>{
    try {
        const id = req.headers.id
        const userData = await User.findById(id)
        const cart = userData.cart.reverse()

        return res.status(200).json({
            data: cart
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
    })
}
})


module.exports = router