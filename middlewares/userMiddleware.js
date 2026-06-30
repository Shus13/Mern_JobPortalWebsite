const jwt = require('jsonwebtoken');
const User = require('../model/userModel');  

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;

    console.log("Token received:", token);  

    if (!token) {
        return res.status(400).json({ message: "Unauthorized access" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log("JWT Error:", err.message);  
            return res.status(400).json({ message: "Invalid token" });
        }

        const userId = decoded.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        req.user = user;
        next();
    });
}

module.exports = { isAuthenticated };