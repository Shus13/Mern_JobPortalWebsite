const {Job} = require("../model/index");

const createJob = async (req, res) => {
  const { title, description, company, location, salary, userID } = req.body;

  if(!title || !description || !location) {
    return res.status(400).json({message: "Please provide all required fields"});
  }

  const job = await Job.create({
    title,
    description,
    location,
    company,
    salary,
    userID
  })

  res.status(201).json({message: "Job created successfully", job}); 
}

module.exports = {createJob};