const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth")

const mongoose = require("mongoose");
router.put("/add-book-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.headers;
    const userId = req.user.id; // get from token
    const userData = await User.findById(userId);

    // Convert string to ObjectId for comparison
    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    const isBookFavourite = userData.favourites.some(fav => fav.equals(bookObjectId));

    if (isBookFavourite) {
      return res.status(200).json({ msg: "Book is already in Favourites" });
    }

    await User.findByIdAndUpdate(userId, { $push: { favourites: bookObjectId } });

    return res.status(200).json({ msg: "Book added to favourites" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Unable to add to favourite" });
  }
});


module.exports = router