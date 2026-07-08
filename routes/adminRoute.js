const Router = require("express").Router();
const { isAuthenticated } = require("../middlewares/userMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
  getUserById,
  downloadUserResume,
} = require("../Controller/adminController");

Router.get("/stats", isAuthenticated, isAdmin, getAdminStats);
Router.get("/users", isAuthenticated, isAdmin, getAllUsers);
Router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);
Router.get("/jobs", isAuthenticated, isAdmin, getAllJobsAdmin);
Router.delete("/jobs/:id", isAuthenticated, isAdmin, deleteJobAdmin);
Router.get("/users/:id", isAuthenticated, isAdmin, getUserById);
Router.get("/users/:id/resume/download", isAuthenticated, isAdmin, downloadUserResume);

module.exports = Router;