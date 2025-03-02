const mongoose = require("mongoose");

const ReserveSchema = new mongoose.Schema({
    reservationDate: Date,
    numOfGuests: Number
});

module.exports = mongoose.model("reserve", ReserveSchema);