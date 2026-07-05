require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./model");
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-job-portal-website-frontend.vercel.app",
    ],
  }),
);

const { connectDb } = require("./database/dbconfig");
connectDb();
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/userRoute");
app.use("/api/auth", userRouter);

const jobRoute = require("./routes/jobRoute");
app.use("/api/jobs", jobRoute);

const applicationRoute = require("./routes/applicationRoute");
app.use("/api/app", applicationRoute);

port = process.env.Port;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
