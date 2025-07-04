const mongoose = require("mongoose");

const user = new mongoose.mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "../image.png"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    favourites: [{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
    cart: [{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
}, {timestamps: true})

module.exports = mongoose.model("user", user);