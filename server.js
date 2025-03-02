const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const detailsRoutes = require("./routes/details");
const reservationRoutes = require("./routes/reservationRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const MONGO_URI = "mongodb+srv://3940575:3940575@cluster0.bldd0.mongodb.net/"; 
require("dotenv").config();

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Successfully connected to MongoDB!"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Use ejs template
app.set("view engine", "ejs");

// Use Routes
app.use("/", detailsRoutes);
app.use("/reservations", reservationRoutes);

// Passport config
require("./config/passport")(passport);

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: MONGO_URI }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", require("./routes/auth"));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
