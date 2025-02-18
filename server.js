const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// MongoDB connection string (local MongoDB)
const MONGO_URI = "mongodb+srv://3940575:3940575@cluster0.bldd0.mongodb.net/"; 

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Set up the default route
app.get("/", (req, res) => {
  res.send("The server is running successfully and connected to MongoDB!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
