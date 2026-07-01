const Router = require("express").Router();
const {createJob, getAllJobs, getMyJobs, getSingleJob, updateJob, deleteJob} = require("../Controller/jobController");
const {isAuthenticated } = require('../middlewares/userMiddleware')


Router.post("/job", isAuthenticated, createJob)
Router.get("/jobs", getAllJobs)
Router.get("/jobs/:id", getSingleJob)
Router.patch("/jobs/:id",isAuthenticated, updateJob)

module.exports = Router;