const jwt = require("jsonwebtoken");

const auth = (req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    try {
        const decode=jwt.verify(token,"masai")
        if(decode){
            req.body.userId=decode.userId
            next()
        }else{
            res.send({"msg":"Please Login Again"})
        }
        }catch (error) {
        res.status(400).send({'error':error})
        }
}

module.exports = {auth}