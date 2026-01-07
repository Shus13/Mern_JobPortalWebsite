const {registerUser, loginUser} = require ("../Controller/userController");

const Router = require ("express").Router();

Router.post("/register", registerUser);
Router.post("/login", loginUser);

module.exports = Router;