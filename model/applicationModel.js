const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/dbconfig')


const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    status: {
        type: DataTypes.ENUM("applied", "in_review", "accepted", "rejected"),
        allowNull: false,
        defaultValue: 'applied',
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    jobId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["userId", "jobId"],
        }
    ]
})



module.exports = Application