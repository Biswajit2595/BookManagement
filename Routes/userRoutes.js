const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const { UserModel } = require("../Model/userModel");
const userRouter = express.Router();


// Register
userRouter.post("/signup",async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const user=await UserModel.findOne({email})
        if(user){
            res.send({"msg":"User is already a registered User"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(400).send(err)
                }else{
                    const newUser=new UserModel({name,email,password:hash})
                    await newUser.save()
                    res.status(200).send({"msg":"New User has been registered"})
                }
            })
        }
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})


// Login
userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        let user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,async(err,result)=>{
                if(result){
                    let token = jwt.sign({userId: user._id},"masai");
                    res.status(200).send({msg:"User Successfully Logged In",token});
                    
                }else{
                    res.status(400).send({msg:"Wrong Credentials!!"});
                }
            })
        }else{
            res.status(400).send({msg:"User doesn't Exists!!"});
        }
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})


module.exports = {userRouter};