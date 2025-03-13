const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const reservation = require("../models/Reservation");
const router = express.Router();

// Render login page
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/admin", async (req, res) => {
    try {
        const rows = await reservation.find({});

        const formattedRows = rows.map(row => ({
            _id: row._id.toString(),
            customerName: row.customerName,
            reservationDate: row.reservationDate.toISOString().split('T')[0],
            numOfGuests: row.numOfGuests,
            status: row.status
        }));

        res.render("admin", { rows: formattedRows });
    } catch (err) {
        console.error("❌ Failed to load reservations:", err);
        res.render("admin", { rows: [] });
    }
});


router.post("/update-status", async (req, res) => {
    const { id, status } = req.body;

    console.log("📝 Received update request:", { id, status });

    if (!id || !status) {
        console.error("❌ Invalid ID or status");
        return res.redirect("/admin");
    }

    try {
        const updateResult = await reservation.findByIdAndUpdate(id, { status }, { new: true });
        console.log("✅ Update result from MongoDB:", updateResult);

        if (!updateResult) {
            console.error("❌ No document found with this ID:", id);
        }

        res.redirect("/admin");
    } catch (err) {
        console.error("❌ Failed to update reservation status:", err);
        res.redirect("/admin");
    }
});


module.exports = router;

// Register user
router.post("/register", async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash("error_msg", "Passwords do not match");
        return res.redirect("/");
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            req.flash("error_msg", "Email is already registered");
            return res.redirect("/");
        }

        user = new User({ fullName, email, password });
        await user.save();

        req.flash("success_msg", "Registration successful! You can now log in.");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("error_msg", "Something went wrong");
        res.redirect("/");
    }
});

// Login user
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect("/");

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Redirect based on isAdmin status
            if (user.isAdmin) {
                return res.redirect("/admin");
            } else {
                return res.redirect("/home");
            }
        });
    })(req, res, next);
});

// Logout user
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success_msg", "You have logged out");
        res.redirect("/");
    });
});

module.exports = router;
