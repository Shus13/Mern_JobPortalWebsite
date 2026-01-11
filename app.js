const express = require("express");
const { connectDb } = require("./database/dbconfig");
const app = express();
require("dotenv").config();
app.use(express.json());

connectDb();

const userRouter = require ("./routes/userRoute")

app.use("/api/auth", userRouter);

port = process.env.Port

app.listen(port, () => {
  console.log("Server is running..");
});
