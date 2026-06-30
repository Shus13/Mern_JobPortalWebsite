const User = require("./userModel");
const Job = require("./jobModel");


User.hasMany(Job, {foreignKey: "userID"});
Job.belongsTo(User, {foreignKey: "userID"});


module.exports = {User, Job};