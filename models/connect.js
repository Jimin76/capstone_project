const mongoose = require("mongoose");

const ConnectSchema = new mongoose.Schema({
    FoodID: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
    ReserveID: { type: mongoose.Schema.Types.ObjectId, ref: "reservation" }
});

module.exports = mongoose.model("connect", ConnectSchema);