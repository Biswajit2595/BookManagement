const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./Routes/userRoutes");
const { bookRouter } = require("./Routes/booksRoutes");
const PORT = process.env.PORT || 8000;
const app = express();
require("dotenv").config()
app.use(cors());
app.use(express.json());
app.use("/user",userRouter)
app.use("/book",bookRouter)

app.get("/", (req, res) => {
    res.send("Welcome to the Home Page");
});

app.listen(PORT, async () => {
    try {
        await connection;
        console.log('Connected to the database');
    } catch (error) {
        console.log(error);
    }
});

