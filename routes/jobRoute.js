const {createJob, getAllJobs} = require("../Controller/jobController");

const Router = require("express").Router();

Router.post("/create", createJob);

module.exports = Router;