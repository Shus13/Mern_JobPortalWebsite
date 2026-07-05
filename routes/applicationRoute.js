const { jobApply, getMyApplications, getApplicantByJob, updateApplicationStatus, withdrawApplication, downloadApplicantResume } = require('../Controller/applicationController');
const { isAuthenticated } = require('../middlewares/userMiddleware');

const Router = require('express').Router();




Router.post("/:jobId", isAuthenticated, jobApply)
Router.get("/my", isAuthenticated, getMyApplications)
Router.get("/job/:jobId", isAuthenticated, getApplicantByJob)
Router.patch("/:id/status", isAuthenticated, updateApplicationStatus)
Router.delete("/:id", isAuthenticated, withdrawApplication)
Router.get("/:id/resume/download", isAuthenticated, downloadApplicantResume);


module.exports = Router;