const { Op } = require("sequelize");
const User = require("../model/userModel");
const Job = require("../model/jobModel");
const Application = require("../model/applicationModel");

// Dashboard overview stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: { [Op.ne]: "Admin" } } });
    const totalJobSeekers = await User.count({ where: { role: "JobSeeker" } });
    const totalEmployers = await User.count({ where: { role: "JobProvider" } });
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();

    res.status(200).json({
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// View all users (job seekers + employers) — admins hidden from the list
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "profilePhoto", "createdAt"],
      where: { role: { [Op.ne]: "Admin" } },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a user account
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Admin") {
      return res.status(403).json({ message: "Cannot delete an admin account" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// View every job on the platform, regardless of owner
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: { model: User, attributes: ["id", "name", "email"] },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ count: jobs.length, jobs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete any job, regardless of ownership (bypasses the employer-only check)
const deleteJobAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// adminController.js
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "profilePhoto", "resume", "createdAt"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const path = require("path"); 
const downloadUserResume = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.resume) return res.status(404).json({ message: "This user has not uploaded a resume" });

    const filePath = path.join(__dirname, "..", user.resume);
    res.download(filePath, `${user.name}-resume${path.extname(filePath)}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
  getUserById,
  downloadUserResume
};