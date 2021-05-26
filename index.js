const express = require('express');
const path = require("path");
const connectDb = require('./db');
const cors = require('cors');

// app
const app = express();
connectDb();

// constants
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, "uploads/")));
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, DELETE, PATCH");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     //res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
// });
// routes
const auth = require('./routes/auth');
const profileRoute = require('./routes/profile');
const recipeRoute = require('./routes/recipe');
const categoryRoute = require('./routes/category');
const subcategoryRoute = require('./routes/subcat');
const restaurantRoute = require('./routes/restaurant')
const menuRoute = require('./routes/menu')

app.use('/api/auth', auth);
app.use('/api/profile', profileRoute);
app.use('/api/category', categoryRoute);
app.use('/api/subcategory', subcategoryRoute);
app.use('/api/recipe', recipeRoute);
app.use('/api/restaurant', restaurantRoute)
app.use('/api/menu', menuRoute)


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