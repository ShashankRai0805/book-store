const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next)=>{
    console.log("=== AUTHENTICATION DEBUG ===");
    console.log("Auth header:", req.headers["authorization"]);
    console.log("User ID header:", req.headers["id"]);
    console.log("============================");
    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null){
        console.log("ERROR: No token provided");
        return res.status(401).json({
            msg: "Authentication token required"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            console.log("ERROR: Token verification failed:", err.message);
            return res.status(401).json({
                msg: "Please login again"
            });
        }
        console.log("Authentication successful for user:", user);
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken }