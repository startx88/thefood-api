const express = require('express');
const path = require("path");
const connectDb = require('./db');

// app
const app = express();
connectDb();

// constants
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, "uploads/")));



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    //res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
// routes
const recipeRoute = require('./routes/recipe');
const userRoute = require('./routes/user');
app.use('/api/recipe', recipeRoute);
app.use('/api/user', userRoute);

// Errors 
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.statusCode = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        errors: {
            message: error.message,
            status: error.statusCode
        }
    })
});

// server is listening
app.listen(PORT, () => {
    console.log("server is running...", PORT)
})