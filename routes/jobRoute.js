const {createJob, getAllJobs} = require("../Controller/jobController");
const {isAuthenticated } = require('../middlewares/userMiddleware')

const Router = require("express").Router();

// router.route("/job").post(createJob)
Router.post("/job", isAuthenticated, createJob)
Router.get("/jobs", getAllJobs)

module.exports = Router;