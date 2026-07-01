const User = require("./userModel");
const Job = require("./jobModel");
const Application = require("./applicationModel");


User.hasMany(Job, {foreignKey: "userId"});
Job.belongsTo(User, {foreignKey: "userId"});

User.hasMany(Application, {foreignKey: "userId"})
Application.belongsTo(User, {foreignKey: "userId"})

Job.hasMany(Application, {foreignKey: "jobId"})
Application.belongsTo(Job, {foreignKey: "jobId"})

module.exports = {User, Job, Application};