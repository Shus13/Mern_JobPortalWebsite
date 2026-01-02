 const app = require("express")()

 app.get("/", (req,res) => {
    res.send("This is the Home page")
 })

 app.get("/about", (req,res) => {
    res.send("This is About Page")
 })




 app.listen(4000, ()=>{
    console.log("Server is running in the port no. 4000")
 })