const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

require("dotenv").config();

const { connectDb } = require("./database/dbconfig");
connectDb();

const jwt = require("jsonwebtoken");

const userRouter = require ("./routes/userRoute")
app.use("/api/auth", userRouter);

const jobRoute = require("./routes/jobRoute")
app.use("/api/auth", jobRoute)

app.get("/", (req,res) => {
  res.json({
    status : 200,
    message : "Done"
  })
})

port = process.env.Port
app.listen(port, () => {
  console.log("Server is running on port", port);
});
