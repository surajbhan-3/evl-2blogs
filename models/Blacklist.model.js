const mongoose=require("mongoose")


const BlacklistSchema=mongoose.Schema({
 
      actoken:String,
      reftoken:String

})

const BlacklistModel=mongoose.model("blog",BlacklistSchema)

module.exports={BlacklistModel}