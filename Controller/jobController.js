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

// Get all job
const getAllJobs = async (req, res)=>{
    const jobs = await Job.findAll({
        include: {
            model: User,
            attributes: ["id", "username", "userEmail"]
        }
    });
    if(jobs.length ===0){
        return res.status(400).json({
            message: "No jobs available"
        })
    }
    res.status(200).json({
        data: jobs
    })
}

module.exports = {
    createJob,
    getAllJobs
}