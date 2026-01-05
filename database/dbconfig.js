const { Sequelize } = require("sequelize");

const DATABASE_URL = "postgresql://postgres.ixchtwrpytbuezjcgkbc:%40Sushit%40133@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const sequelize = new Sequelize(DATABASE_URL, {
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
    await sequelize.authenticate();
    await sequelize.sync({alter:false, force:false});
    console.log("Connection has been established");
  } catch (error) {
    console.error("Unable to connect the database:", error);
  }
};

module.exports = { connectDb, sequelize };
