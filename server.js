// server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// MongoDB connection
const MONGO_URI =
  "mongodb+srv://3940575:3940575@cluster0.bldd0.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// EJS and static files setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB!");
});

// Reservation routes
const reservationRoutes = require("./routes/reservationRoutes");
app.use("/reservations", reservationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
