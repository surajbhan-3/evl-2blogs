const express=require("express")
const {connection}= require("./config/db")
const cookieParser=require("cookie-parser")
const {userRouter}=require("./routes/Users.routes")
const {blogRouter}=require("./routes/blog.routes")
const {authenticate}=require("./middleware/authenticate.middleware")
require("dotenv").config()





const app=express()
app.use(express.json())
app.use(cookieParser)


app.get("/",async(req,res)=>{
   
     try {
        console.log("hello")
        res.send("Welcome")
     } catch (error) {
        res.send(error)
     }
})

app.use("/user",userRouter)

app.use(authenticate)
app.use("/blog",blogRouter)


app.listen(process.env.port,async(req,res)=>{


    try {
        await connection
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }

    console.log("Server is running",process.env.port)
})