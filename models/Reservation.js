// models/Reservation.js
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  numOfGuests: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "Pending",
  },
});


module.exports = mongoose.model("Reservations", reservationSchema, "reservations");
