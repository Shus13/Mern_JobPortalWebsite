// middleware is a function that has access to the request and response objects.
const jwt = require('jsonwebtoken');
const { User } = require('../model');

const isAuthenticated = (req, res, next) => {

    // token receive
    const token = req.headers.authorization

    // token check
    if (!token) {
        return res.status(400).json({
            message: "Unauthorized access"
        })
    }

    // token verify
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(400).json({
                message: "Invalid token"
            })
        } else {
            const userId = decoded.userId

            // Check the user with the id from token

            const user = await User.findByPk(userId)

            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                })
            }
            req.user = user

            next()
        }
    })
}

module.exports = {
    isAuthenticated
}