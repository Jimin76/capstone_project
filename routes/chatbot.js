const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const WEBHOOK_URL = "http://localhost:3000/webhook"; // ebhook URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; //  get GPT API Key 

async function analyzeUserInput(userMessage) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a restaurant chatbot. Your task is to return the correct intent name from the list: [greeting, opening_hours, location, menu, contact, recommend_menu]. Respond with only the intent name." },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.3
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const intent = response.data.choices[0].message.content.trim();
        console.log("Identified Intent:", intent);

        return intent; // Intent
    } catch (error) {
        console.error("Error calling GPT API:", error);
        return "general_question"; 
    }
}

// analysis user input and find data on Dialogflow
router.post("/", async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Step 1: analyse input with GPT
        const intent = await analyzeUserInput(userMessage);
        console.log(`Identified Intent: ${intent}`);

        // Step 2: request to Dialogflow Webhook and get related data
        const dialogflowResponse = await axios.post(WEBHOOK_URL, {
            queryResult: { intent: { displayName: intent }, userMessage: userMessage }
        });

        const botReply = dialogflowResponse.data.fulfillmentText || "Sorry, I didn't understand that.";
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error processing request:", error);
        res.json({ reply: "Sorry, I couldn't process your request." });
    }
});

module.exports = router;
