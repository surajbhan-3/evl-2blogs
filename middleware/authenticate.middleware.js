const jwt= require("jsonwebtoken")
const { BlacklistModel } = require("../models/Blacklist.model");
const { UserModel } = require("../models/User.model");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require("dotenv").config()



const authenticate= async (req,res,next)=>{


   try {
    
    const {actoken,reftoken}=req.cookies;

    if(actoken==undefined){
        return res.send({"msg":"please lgoin"})
    }

    const istokenblacklisted= await BlacklistModel.findOne({actoken:actoken})

    if(!istokenblacklisted.length>0){
        jwt.verify(actoken,process.env.Skey, async(err,decoded)=>{

            if(err.message=="jwt expired"){
                const newactoken= await fetch("http://localhoset:4500/user/refresh-token",{
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":req.cookies.reftoken
                    }
                }).then((res)=>res.json());
                res.cookie("actoken",newactoken, {maxAge:1000*60})
                next()
            }else {
                const isrefreshtokendblacklist= await BlacklistModel.findOne({reftoken:reftoken})
                if(isrefreshtokendblacklist){
                    return res.send({"msg":"please lgoin........"})   
                }
                next()
            }
        })
    }else{
        const decodedToken=jwt.verify(actoken,process.env.Skey)
        const {email}=decodedToken
        const user= await UserModel.findOne({email:email})
        const role= user?.role
        req.role=role


        next()
    }

   } catch (error) {
    res.send(error)
   }

     
}

module.exports={authenticate}