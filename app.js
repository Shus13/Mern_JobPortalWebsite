 const express = require("express")
 const app = express()

 app.use(express.json())

 app.get("/", (req,res) => {
    res.send("This is the Home page")
 })

 app.get("/about", (req,res) => {
    res.send("This is About Page")
 })

 app.post("/hello", (req,res) => {
   console.log(req.body)
   res.send("This is post request")
 })



 app.listen(4000, ()=>{
    console.log("Server is running in the port no. 4000")
 })