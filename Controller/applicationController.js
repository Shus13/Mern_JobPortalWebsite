const Application = require("../model/applicationModel")
const Job = require("../model/jobModel")
const User = require("../model/userModel")

const path = require("path");

// Job Apply
const jobApply = async (req,res) => {
    try {
        const {jobId} = req.params;

        const job = await Job.findByPk(jobId)

        if(!job){
            return res.status(404).json({
                message: "Job not found",
            })
        }

        const alreadyApplied = await Application.findOne({
            where: {
                jobId,
                userId: req.user.id,
            }
        })

        if(alreadyApplied){
            return res.status(200).json({
                message: "You have already applied for this job"
            })
        }

        const application = await Application.create({
            jobId,
            userId: req.user.id,
        })
        return res.status(200).json({
            message: "Application submitted successfully",
            application,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

// Get Application
const getMyApplications = async (req,res) => {
    try {
        const applications = await Application.findAll({
            where: {
                userId: req.user.id,
            },
            include: [
                {
                    model: Job,
                }
            ],
            order: [["createdAt", "DESC"]]
        })
        return res.status(200).json({
            count: applications.length,
            applications
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Get applicant of specific jobs
const getApplicantByJob = async (req,res) => {
    try {
        const {jobId} = req.params

        const applicants = await Application.findAll({
            where: {
                jobId
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email", "profilePhoto", "resume"],
                }
            ],
            order: [["createdAt", "DESC"]],
        })
        return res.status(200).json({
            count: applicants.length,
            applicants
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body

        const validStatuses = [
            "pending",
            "reviewed",
            "accepted",
            "rejected"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const application = await Application.findByPk(id)

        if(!application){
            return res.status(404).json({
                message: "Application not found"
            })
        }

        application.status = status;
        await application.save()

        return res.status(200).json({
            message: "Application status updated successfully",
            application
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Withdraw application
const withdrawApplication = async (req,res) => {
    try {
        const {id} = req.params
        const application = await Application.findOne({
            where: {
                id,
                userId: req.user.id
            }
        })

        if(!application){
            return res.status(404).json({
                message: "Application not found"
            })
        }

        await application.destroy()
        return res.status(200).json({
            message: "Application withdrawn successfully"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const downloadApplicantResume = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const application = await Application.findByPk(id, {
      include: [{ model: Job }, { model: User }],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only the employer who owns this job can download the applicant's resume
    if (application.Job.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!application.User.resume) {
      return res.status(404).json({ message: "Applicant has not uploaded a resume" });
    }

    const filePath = path.join(__dirname, "..", application.User.resume);
    res.download(filePath, `${application.User.name}-resume${path.extname(filePath)}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    jobApply,
    getMyApplications,
    getApplicantByJob,
    updateApplicationStatus,
    withdrawApplication,
    downloadApplicantResume
}