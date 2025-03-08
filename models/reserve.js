const mongoose = require("mongoose");

const ReserveSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reservationDate: Date,
    numOfGuests: Number
});

module.exports = mongoose.model("reserve", ReserveSchema);