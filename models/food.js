const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    Name: String,
    Price: Number
});

module.exports = mongoose.model("food", FoodSchema);