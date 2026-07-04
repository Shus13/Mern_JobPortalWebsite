const Router = require("express").Router();
const {createJob, getAllJobs, getMyJobs, getSingleJob, updateJob, deleteJob} = require("../Controller/jobController");
const {isAuthenticated } = require('../middlewares/userMiddleware')


Router.post("/", isAuthenticated, createJob)
Router.get("/my", isAuthenticated, getMyJobs)
Router.get("/", getAllJobs)
Router.get("/:id", getSingleJob)
Router.patch("/:id",isAuthenticated, updateJob)
Router.delete("/:id", isAuthenticated, deleteJob)

module.exports = Router;