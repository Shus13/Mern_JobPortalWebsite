const express = require("express");
const { connectDb } = require("./database/dbconfig");
const app = express();

app.use(express.json());

connectDb();

const userRouter = require ("./routes/userRoute")

app.use("/api/auth", userRouter);


app.listen(4000, () => {
  console.log("Server is running in the port no. 4000");
});
