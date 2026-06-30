const { Sequelize } = require("sequelize");

const dburl = process.env.DATABASE_URL;

const sequelize = new Sequelize(dburl, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const connectDb = async () => {
  try {
    await sequelize.authenticate(); //connection check garna
    await sequelize.sync({alter:false, force:false}); //exist data delete gardaina false ley
    console.log("Connection has been established");
  } catch (error) {
    console.error("Unable to connect the database:", error);
  }
};

module.exports = { connectDb, sequelize };