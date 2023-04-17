const express=require("express");
const { BlacklistModel } = require("../models/Blacklist.model");
const userRouter=express.Router()
const {UserModel}=require("../models/User.model")




userRouter.post("/register",async(req,res)=>{



    try {
        const {name,email,password,role}=req.body;
        const userExists= await UserModel.findOne({email:email})

        if(userExists){
            return res.send({"Msg":"Already Registered please login"})
        }
        const hashed_password=bcrypt.hashSync(password,5)
        const User=new UserModel({name,email,password:hashed_password,role})
          await User.save()

          res.json({"msg":"User register Successfully","user":User})     

    } catch (error) {
        
        res.json({"msg":error.message})
    }
})


userRouter.post("/login",async(req,res)=>{

    try {
        const {email,password}=req.body;
        const user= await UserModel.findOne({email})

        if(!user){
            res.send({"msg":"Invalid username or password"})
        }
        const matchpass= bcrypt.compare(password,user.password)
        if(!matchpass){
            res.send({"msg":"Invalid username or password"})
        }
        const accessToken=jwt.sign({email},process.env.Skey,{expiresIn:"1m"})
        const refreshToken=jwt.sign({email},process.env.Rkey,{expiresIn:"3m"})

        res.cookie("actoken", accessToken,{maxAge:1000*60})

        res.cookie("reftoken",refreshToken,{maxAge:3000*60})

        res.send({"msg":"login Successful", "user":user})
        
    } catch (error) {
        
        console.log({"msg":error.message})
    }
})



userRouter.get("/logout",async(req,res)=>{

    try {
        const {actoken,reftoken}=req.cookies
        const blacklisttokens= await new BlacklistModel.$where({actoken:actoken,reftoken:reftoken})        
       await  blacklisttokens.save()
       res.send({"msg":"Logout Successfuly"})
    } catch (error) {
        res.send({"msg":error.message})
    }
})


userRouter.post("/refresh-token",async(req,res)=>{

    try {
        const reftoken=req.cookies.reftoken|| req?.headers?.authorization
        const istokenblacklisted= await BlacklistModel.findOne({reftoken:reftoken})
        if(istokenblacklisted){
            res.send({"msg":"Please login ..ref.."})  
        }
        const isrefreshtoken = jwt.verify(reftoken,process.env.Rkey)
        if(!isrefreshtoken){
            res.send({"msg":"Please login ..ref.."})  
        }
        const newtoken=jwt.sign({email:isrefreshtoken.email},process.env.Skey,{expiresIn:"1m"})
        res.cookie("actoken", newtoken,{maxAge:1000*60} )
        res.send({"msg":"token is generated"})  

    } catch (error) {
        
    }
})

module.exports={userRouter}