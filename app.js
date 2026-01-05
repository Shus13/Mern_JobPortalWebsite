const express = require("express");
const { connectDb } = require("./database/dbconfig");
const app = express();

app.use(express.json());

connectDb();
const userRouter = require ("./routes/userRoute")
app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("This is the Home page");
});

app.post("/hello", (req, res) => {
  console.log(req.body);
  res.send("This is post request");
});

app.listen(4000, () => {
  console.log("Server is running in the port no. 4000");
});
