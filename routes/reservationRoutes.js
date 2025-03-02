// routes/reservationRoutes.js
const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// GET /reservations (with optional search)
router.get("/", async (req, res) => {
  try {
    const { searchTerm } = req.query;
    let query = {};

    if (searchTerm && searchTerm.trim() !== "") {
      const regex = new RegExp(searchTerm, "i");
      const parsedDate = new Date(searchTerm);
      const isValidDate = !isNaN(parsedDate.getTime());

      if (isValidDate) {
        const nextDay = new Date(parsedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query = {
          $or: [
            { customerName: regex },
            { status: regex },
            { reservationDate: { $gte: parsedDate, $lt: nextDay } }
          ]
        };
      } else {
        query = {
          $or: [
            { customerName: regex },
            { status: regex }
          ]
        };
      }
    }

    const reservations = await Reservation.find(query).sort({ reservationDate: 1 });
    res.render("reserve", { reservations, searchTerm });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Server error: Failed to fetch reservations");
  }
});

// PUT /reservations/:id/cancel
router.put("/:id/cancel", async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "Canceled" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Respond with JSON or any format you prefer
    return res.json({ success: true, reservation });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    res.status(500).json({ error: "Server error: Failed to cancel reservation" });
  }
});

module.exports = router;
