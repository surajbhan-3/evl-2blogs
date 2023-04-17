const mongoose=require("mongoose")


const BlogSchema=mongoose.Schema({
 
      title:String,
      body:String,
      email:String

})

const BlogModel=mongoose.model("blogsdata",BlogSchema)

module.exports={BlogModel}
