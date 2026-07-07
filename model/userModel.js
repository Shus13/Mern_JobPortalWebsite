const { DataType, DataTypes } = require("sequelize");
const { sequelize } = require("../database/dbconfig");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("JobSeeker", "JobProvider", "Admin"),
    allowNull: false,
    defaultValue: "JobSeeker",
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordToken: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  resetPasswordExpires: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
});

module.exports = User;
