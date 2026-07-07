const { uploadPhoto, uploadResume } = require("../middlewares/uploadMiddleware");
const {registerUser, loginUser, getProfile, updateProfilePhoto, updateResume, downloadResume, updateProfile, forgotPassword, resetPassword} = require ("../Controller/userController");
const { isAuthenticated } = require("../middlewares/userMiddleware");

const Router = require ("express").Router();

Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.get("/profile", isAuthenticated, getProfile);
Router.patch("/profile", isAuthenticated, updateProfile);
Router.patch("/profile/photo", isAuthenticated, uploadPhoto.single("photo"), updateProfilePhoto);
Router.patch("/profile/resume", isAuthenticated, uploadResume.single("resume"), updateResume);
Router.get("/profile/resume/download", isAuthenticated, downloadResume);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password/:token", resetPassword);


module.exports = Router;

