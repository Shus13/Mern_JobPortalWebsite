const {registerUser} = require ("../Controller/userController");
const Router = require ("express").Router();
Router.post("/register", registerUser);

module.exports = Router;