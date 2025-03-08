const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    Price: Number
});

module.exports = mongoose.model("food", FoodSchema);