const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/books")
const {authenticateToken} = require("./userAuth")

router.put("/add-book-to-favourite", authenticateToken, async (req, res)=>{
  try {
    const bookId = req.headers.bookid
    console.log(req.headers.bookId)
    const id = req.headers.id
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookId);
    if(isBookFavourite){
      res.status(200).json({
        msg: "Book already in Fav"
      })
    }
    await User.findByIdAndUpdate(id, { $addToSet: { favourites: bookId } });

    return res.status(200).json({
      msg: "Book added to favourites"
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
      error: error.message
    })
  }
})



module.exports = router;