const { Job, User } = require("../model/index");

// Post job
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    if (req.user.role !== "JobProvider") {
      return res.status(403).json({
        message: "Only Job providers can create jobs",
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      company,
      salary,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get all job
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: {
        model: User,
        attributes: ["id", "name", "email"],
      },
    });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Single Job
const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id, {
      include: {
        model: User,
        attributes: ["id", "name", "email"],
      },
    });
    if (!job) {
      return res.status(404).json0({
        message: "Job not found",
      });
    }
    return res.status(200).json(job);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server Error",
    });
  }
};

// Update JOb
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
      });
    }

    await job.update(req.body);

    return res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
      });
    }

    await job.destroy();

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Logged-in Provider's Jobs
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: {
        userId: req.user.id,
      },
    });
    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getMyJobs
};
