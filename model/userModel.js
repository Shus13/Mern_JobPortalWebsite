 const {DataType, DataTypes} = require("sequelize")
 const {sequelize} =  require ("../database/dbconfig")

 const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("JobSeeker", "JobProvider"),
        allowNull: false,
        defaultValue: "JobSeeker"
    }
 })

 module.exports = User;