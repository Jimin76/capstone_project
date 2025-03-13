const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    reservationDate: { type: Date, required: true },
    numOfGuests: { type: Number, required: true },
    status: { type: String, required: true, default: "Pending" }
});

module.exports = mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema, "reservations");
