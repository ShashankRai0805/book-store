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

app.listen(process.env.PORT, ()=>{
    console.log(`Server started at port ${process.env.PORT}`);
});