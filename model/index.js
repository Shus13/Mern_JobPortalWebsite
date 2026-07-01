const User = require("./userModel");
const Job = require("./jobModel");



User.hasMany(Job, {foreignKey: "userId"});
Job.belongsTo(User, {foreignKey: "userId"});



module.exports = {User, Job};