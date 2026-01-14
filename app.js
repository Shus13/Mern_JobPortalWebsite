const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

require("dotenv").config();

const { connectDb } = require("./database/dbconfig");
connectDb();

const userRouter = require ("./routes/userRoute")
app.use("/api/auth", userRouter);

const jobRoute = require("./routes/jobRoute")
app.use("/api/auth", jobRoute)


const token = jwt.sign({userId: isExistingUser.id}, "dp@12345SECRET", {
  expiresIn: "30d"
})

port = process.env.Port
app.listen(port, () => {
  console.log("Server is running on port ${port}");
});
