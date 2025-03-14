const express = require("express");
const router = express.Router();

// 레스토랑 정보
const restaurant = {
    name: "Grill House Restaurant",
    location: "123 Teheran-ro, Gangnam-gu, Seoul",
    hours: {
        weekday: "11:00 AM - 10:00 PM",
        weekend: "10:00 AM - 11:00 PM"
    },
    menu: [
        { name: "Steak", price: "$25.00" },
        { name: "Seafood Pasta", price: "$18.00" },
        { name: "Salad", price: "$12.00" }
    ],
    contact: "+82-2-1234-5678"
};

router.post("/", async (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName || "general_question";
  console.log("Received Intent:", intent); // ✅ Webhook에서 intent 로그 확인

  let responseText = "Sorry, I couldn't find the requested information.";

  if (intent === "greeting") {
      responseText = "Hello! How can I assist you today?"; // ✅ 기본 인사 추가
  } else if (intent === "opening_hours") {
      responseText = `Our opening hours are: Weekdays from ${restaurant.hours.weekday}, Weekends from ${restaurant.hours.weekend}.`;
  } else if (intent === "location") {
      responseText = `Our restaurant is located at ${restaurant.location}.`;
  } else if (intent === "menu") {
      responseText = `Our menu includes: ${restaurant.menu.map(m => `${m.name} (${m.price})`).join(", ")}.`;
  } else if (intent === "contact") {
      responseText = `You can reach us at ${restaurant.contact}.`;
  }

  console.log("Webhook Response:", responseText); // ✅ Webhook 응답 로그 추가
  res.json({ fulfillmentText: responseText });
});


module.exports = router;
