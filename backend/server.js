require('dotenv').config(); // Load environment variables

const express = require("express");
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const body_parser = require("body-parser");
const userRouter = require("./routes/userRoutes");
const verificationModels = require('./model/verificationModel');
const userModels = require('./model/userModel');
require('./config/dbConnection');
require('./controller/auth');

// Initialize models
userModels.createTable();
verificationModels.createTable();

const PORT = 8001;
const app = express();

// Middleware setup
app.use(express.json());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use(session({
    secret: '8d9b68b15a6aa53f7747ae3adac68d98adda9155c21faa5c4de0c50e0c99251bba46452cf65663fbe15d1a9d236c0558ad5a1346198f62f4e1c97c2b9ae57373', // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using https
}));

app.use(passport.initialize());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use('/api', userRouter);

// Error handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({ message: err.message });
});

app.listen(PORT, () => console.log('Server is running on Port ' + PORT));
