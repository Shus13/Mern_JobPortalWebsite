const Application = require("../model/applicationModel")
const Job = require("../model/jobModel")
const User = require("../model/userModel")

// Job Apply
const jobApply = (req,res) => {
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
                userId: req.user,
            }
        })

        if(alreadyApplied){
            return res.status(200).json({
                message: "You have already applied for this job"
            })
        }

        const application = await Application.create({
            jobId,
            userId: req.user,
        })
        return res.status(200).json({
            message: "Application submitted successfully",
            application,
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            message: "Internal Server Error",
        })
    }
}

// Get Application
const getMyApplications = async (req,res) => {
    try {
        const applications = await Application.findAll({
            where: {
                userId: req.user,
            },
            include: [
                {
                    model: job,
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
                    attributes: ["id", "name", "email"],
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
                userId: req.user
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

module.exports = {
    jobApply,
    getMyApplications,
    getApplicantByJob,
    updateApplicationStatus,
    withdrawApplication
}