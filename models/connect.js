const mongoose = require("mongoose");

const ConnectSchema = new mongoose.Schema({
    FoodID: Number,
    ReserveID: Number
});

module.exports = mongoose.model("connect", ConnectSchema);