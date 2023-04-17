
const authorise=(permittedRole)=>{


    return (req,res,next)=>{
        const UserRole=req.role;
         if(permittedRole.includes(UserRole)){
            next()
         }else{
            res.send("unauthorise")
         }
    }
}

module.exports={authorise}