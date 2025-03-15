const express = require("express");
const axios = require("axios"); 
const router = express.Router();


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
        { name: "Salad", price: "$12.00" },
        { name: "Grilled Chicken", price: "$16.00" },
        { name: "Lobster Bisque", price: "$22.00" },
        { name: "Mushroom Risotto", price: "$17.00" },
        { name: "Cheeseburger", price: "$14.00" },
        { name: "Vegan Tofu Bowl", price: "$13.00" }
    ],
    contact: "+82-2-1234-5678"
};

router.post("/", async (req, res) => {
    const intent = req.body.queryResult?.intent?.displayName || "general_question";
    console.log("Received Intent:", intent); 
    let responseText = "Sorry, I couldn't find the requested information.";

    if (intent === "greeting") {
        responseText = "Hello! How can I assist you today?"; 
    } else if (intent === "opening_hours") {
        responseText = `Our opening hours are: Weekdays from ${restaurant.hours.weekday}, Weekends from ${restaurant.hours.weekend}.`;
    } else if (intent === "location") {
        responseText = `Our restaurant is located at ${restaurant.location}.`;
    } else if (intent === "menu") {
        responseText = `Our menu includes: ${restaurant.menu.map(m => `${m.name} (${m.price})`).join(", ")}.`;
    } else if (intent === "contact") {
        responseText = `You can reach us at ${restaurant.contact}.`;
    } else if (intent === "recommend_menu") {
        const userMessage = req.body.queryResult?.userMessage || "";
        try {
            const gptResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: `You are a restaurant assistant. Based on user's preference, recommend the most suitable dishes from the following menu items: ${restaurant.menu.map(m => m.name).join(", ")}.` },
                        { role: "user", content: `User said: "${userMessage}". Recommend menu.` }
                    ],
                    temperature: 0.5
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const recommendation = gptResponse.data.choices[0].message.content.trim();
            responseText = `Based on your preferences, we recommend: ${recommendation}`;
        } catch (error) {
            console.error("GPT Recommendation Error:", error);
            responseText = "Sorry, I couldn't generate a recommendation at this time.";
        }
    }

    console.log("Webhook Response:", responseText); 
    res.json({ fulfillmentText: responseText });
});

module.exports = router;
