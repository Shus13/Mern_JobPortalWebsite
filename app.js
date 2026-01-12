const express = require("express");
const { connectDb } = require("./database/dbconfig");
const app = express();
require("dotenv").config();
app.use(express.json());

connectDb();

const userRouter = require ("./routes/userRoute")

app.use("/api/auth", userRouter);

port = process.env.Port

 const token = jwt.sign({userId: isExistingUser.id}, "dp@12345SECRET", {
        expiresIn: "30d"
    })

app.listen(port, () => {
  console.log("Server is running..");
});
