const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth")

router.post("/signup", async (req, res)=>{
    console.log("=== SIGNUP DEBUG ===");
    console.log("Request body:", req.body);
    console.log("==================");
    
    try {
        const { username, email, password, address } = req.body;
        
        // Check if all required fields are provided
        if (!username || !email || !password || !address) {
            console.log("Missing required fields");
            return res.status(400).json({
                msg: "All fields are required"
            });
        }
        
        if(username.length < 4){
            console.log("Username too short");
            return res.status(400).json({
                msg: "Username length is short"
            })
        }

        const existingUsername = await User.findOne({username: username});
        if(existingUsername){
            console.log("Username already exists");
            return res.status(400).json({
                msg: "Username already exists"
            })
        }

        const existingEmail = await User.findOne({email: email});
        if(existingEmail){
            console.log("Email already exists");
            return res.status(400).json({
                msg: "Email already exists"
            })
        }

        if(password.length <= 5){
            console.log("Password too short");
            return res.status(400).json({
                msg: "Password length short"
            })
        }

        console.log("Creating new user...");
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address
        });
        
        await newUser.save();
        console.log("User created successfully:", newUser._id);
        
        return res.status(200).json({
            msg: "SignUp Successful"
        })
    } catch (error) {
        console.log("Signup error:", error);
        res.status(500).json({
            msg: "Internal Server Error",
            error: error.message
        })
    }
})

router.post("/login", async (req, res)=>{
   try {
        const {username, password} = req.body;
        
        const existingUser = await User.findOne({username});
        if(!existingUser){
            return res.status(400).json({
                msg: "Invalid Credentials"
            })
        }

        await bcrypt.compare(password, existingUser.password, (err, data)=>{
            if(data){
                const authClaims = [
                    {name: existingUser.username},
                    {role: existingUser.role},
                    {id: existingUser._id}
                ]
                const token = jwt.sign({authClaims}, process.env.JWT_SECRET, {expiresIn: "30d"})
                res.status(200).json({
                    id: existingUser._id,
                    role: existingUser.role,
                    token: token
                })
            }else{
                res.status(400).json({
                    msg: "Invalid Credentials"
                })
            }
        })
   } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
   }
})

router.get("/get-user-information",authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

router.put("/update-address", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address: address});
        return res.status(200).json({
            msg: "Address updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

// Admin routes
router.get("/get-all-users", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const user = await User.findById(id);
        
        if (user.role !== "admin") {
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }
        
        const users = await User.find().select("-password").sort({createdAt: -1});
        return res.status(200).json({
            status: "Success",
            data: users
        });
    } catch (error) {
        console.log("Error fetching users:", error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

router.put("/update-role/:userId", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const {userId} = req.params;
        const {role} = req.body;
        
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({
                msg: "You don't have access to perform admin work"
            });
        }
        
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                msg: "Invalid role. Role must be 'user' or 'admin'"
            });
        }
        
        await User.findByIdAndUpdate(userId, {role: role});
        return res.status(200).json({
            msg: "Role updated successfully"
        });
    } catch (error) {
        console.log("Error updating role:", error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

// Temporary route to make a user admin (for testing purposes)
router.put("/make-admin/:email", async (req, res) => {
    try {
        const {email} = req.params;
        await User.findOneAndUpdate({email: email}, {role: "admin"});
        return res.status(200).json({
            msg: "User promoted to admin successfully"
        });
    } catch (error) {
        console.log("Error making admin:", error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

module.exports = router