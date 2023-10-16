const jwt = require("jsonwebtoken");
const express = require("express");
const { BookModel } = require("../Model/bookModel");
const { auth } = require("../middlewares/authMiddleware");

const bookRouter = express.Router();

//Create 
bookRouter.post("/add",auth,async(req,res)=>{
    let date= new Date().toDateString();
    req.body = {...req.body, published: date};
    try {
        let books = new BookModel(req.body)
        await books.save();
        res.status(201).send({msg:"New Book Added Successfully.",book:req.body});
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"})
    }
})

bookRouter.get("/",async(req,res)=>{
    const {title,author} = req.query;
    const page=req.query.page || 1
    const limit=req.query.limit || 6
    try {
        let query = {};
        if(title){
            query.title = {$regex:title,$options:"i"}
        }
        if(author){
            query.author = {$regex:author,$options:"i"};
        }
        let toSkip  = (page-1)*limit;
        let books = await BookModel.find(query).skip(toSkip).limit(limit);
        let total = await BookModel.countDocuments(query);
        res.status(200).send({books,total});
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:error});
    }
})

bookRouter.get("/:id",async(req,res)=>{
    const {id} = req.params;
    try {
        let book = await BookModel.findOne({_id: id});
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send({msg:"Internal Server Error"});
    }
})

bookRouter.patch("/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findOne({ _id: id });
    try {
        if (req.body.userId !== book.userId) {
            res.send({ msg: "You are not authorized to make changes in this Book" });
        } else {
            const updatedBook = await BookModel.findByIdAndUpdate(id, req.body);
            res.status(200).send({ msg: "Book Updated successfully" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});


bookRouter.delete("/delete/:id",auth,async(req,res)=>{
    const { id } = req.params;
    const book = await BookModel.findOne({ _id: id });
    try {
        if (req.body.userId !== book.userId) {
            res.status(401).send({ msg: "You are not authorized to make changes in this Book" });
        } else {
            const updatedBook = await BookModel.findByIdAndDelete(id);
            res.status(200).send({ msg: "Book Deleted successfully" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

module.exports = {bookRouter};