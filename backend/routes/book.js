const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/books")
const {authenticateToken} = require("./userAuth")

router.post("/add-book", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin"){
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            })
        }

        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
        });
        await book.save();
        res.status(200).json({
            msg: "Book created successfully"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

router.put("/update-book/:id", authenticateToken, async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const { id: userId } = req.headers;
        
        const user = await User.findById(userId);
        if (user.role !== "admin") {
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }

        const updateFields = {};
        if (req.body.url !== undefined) updateFields.url = req.body.url;
        if (req.body.title !== undefined) updateFields.title = req.body.title;
        if (req.body.author !== undefined) updateFields.author = req.body.author;
        if (req.body.price !== undefined) updateFields.price = req.body.price;
        if (req.body.desc !== undefined) updateFields.desc = req.body.desc;
        if (req.body.language !== undefined) updateFields.language = req.body.language;

        await Book.findByIdAndUpdate(bookId, updateFields);
        return res.status(200).json({
            msg: "Book Updated successfully"
        });
    } catch (error) {
        console.log("Error updating book:", error);
        res.status(500).json({
            msg: "An error occured while updating the book"
        });
    }
});

router.delete("/delete-book/:id", authenticateToken, async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const { id: userId } = req.headers;
        
        const user = await User.findById(userId);
        if (user.role !== "admin") {
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }

        await Book.findByIdAndDelete(bookId);
        return res.status(200).json({
            msg: "Book deleted successfully"
        });
    } catch (error) {
        console.log("Error deleting book:", error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

router.get("/get-all-books", async (req, res)=>{
    try {
        const books = await Book.find().sort({createdAt: -1});
        return res.json({
            msg: "Success",
            data: books
        })
    } catch (error) {
        return res.status(500).json({
            msg: "An error occured"
        })
    }
})

router.get("/get-recent-books", async (req, res)=>{
    try {
        const books = await Book.find().sort({createdAt: -1}).limit(4);
        return res.json({
            msg: "Success",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            msg: "Unable to get recently added books"
        })
    }
} )

router.get("/get-book-by-id/:id", async (req, res)=>{
    try {
        const {id} = req.params
        const book = await Book.findById(id);
        return res.status(200).json({
            msg: "Success",
            data: book
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error while getting the book details"
        })
    }
})

module.exports = router;
