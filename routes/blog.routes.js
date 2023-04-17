const express=require("express")
const blogRouter=express.Router()
const {BlogModel}=require("../models/blogs.model")
const {authenticate}=require("../middleware/authenticate.middleware")
const {authorise}=require("../middleware/authories.middleware")








blogRouter.get("/allblogs",async(req,res)=>{

    try {
        
        const payload=req.body;

        const allblogs= await BlogModel.find()
        
        res.send(allblogs)

    } catch (error) {
      res.send(error)   
    }
})



blogRouter.post("/create",async(req,res)=>{

    try {
        
        const payload=req.body;

        const createBlog= new BlogModel(payload)
        await  createBlog.save()

    } catch (error) {
      res.send(error)   
    }
})

blogRouter.delete("/delete/:id",async(req,res)=>{
   const ID=req.params.id
    try {
        await BlogModel.findByIdAndDelete({_id:ID})
        res.send("data is delted")
    } catch (error) {
        
        res.send(error)
    }
})


blogRouter.delete("/delete/:id",authenticate, authorise, async(req,res)=>{
    const ID=req.params.id
     try {
         await BlogModel.findByIdAndDelete({_id:ID})
         res.send("data is delted")
     } catch (error) {
         
         res.send(error)
     }
 })

// blogRouter.get("/",async(req,res)=>{

//     try {
        
//     } catch (error) {
        
//     }
// })

// blogRouter.post("/",async(req,res)=>{

//     try {
        
//     } catch (error) {
        
//     }
// })

module.exports={blogRouter}