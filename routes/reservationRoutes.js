// routes/reservationRoutes.js
const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");


router.post("/add", async (req, res) => {
  try {
      // 🛠️ req.body의 데이터를 출력하여 문제 확인
      console.log("📝 Received data:", req.body);

      const { customerName, reservationDate, numOfGuests } = req.body;

      // 새로운 예약 생성
      const newReservation = new Reservation({
          customerName,
          reservationDate,
          numOfGuests,
          status: "Pending"
      });

      await newReservation.save();
      console.log("✅ Reservation saved:", newReservation);
      
      res.redirect("/");
  } catch (err) {
      console.error("❌ Failed to save reservation:", err);
      res.status(500).send("Server Error");
  }
});



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
