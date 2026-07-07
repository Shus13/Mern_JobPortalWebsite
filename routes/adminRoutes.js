const Router = require("express").Router();
const { isAuthenticated } = require("../middlewares/userMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
} = require("../Controller/adminController");

Router.get("/stats", isAuthenticated, isAdmin, getAdminStats);
Router.get("/users", isAuthenticated, isAdmin, getAllUsers);
Router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);
Router.get("/jobs", isAuthenticated, isAdmin, getAllJobsAdmin);
Router.delete("/jobs/:id", isAuthenticated, isAdmin, deleteJobAdmin);

module.exports = Router;