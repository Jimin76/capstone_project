const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const WEBHOOK_URL = "http://localhost:3000/webhook"; // ✅ Webhook URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // ✅ GPT API Key 가져오기

async function analyzeUserInput(userMessage) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a restaurant chatbot. Your task is to return the correct intent name from the list: [greeting, opening_hours, location, menu, contact]. Respond with only the intent name." },
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

        return intent; // ✅ Intent만 반환하도록 수정
    } catch (error) {
        console.error("Error calling GPT API:", error);
        return "general_question"; // 오류 발생 시 기본 intent 반환
    }
}


// 사용자의 입력을 분석하고 Dialogflow에서 데이터 찾기
router.post("/", async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Step 1: GPT를 이용하여 질문 분석
        const intent = await analyzeUserInput(userMessage);
        console.log(`Identified Intent: ${intent}`);

        // Step 2: Dialogflow Webhook에 요청하여 관련 데이터 가져오기
        const dialogflowResponse = await axios.post(WEBHOOK_URL, {
            queryResult: { intent: { displayName: intent } }
        });

        const botReply = dialogflowResponse.data.fulfillmentText || "Sorry, I didn't understand that.";
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error processing request:", error);
        res.json({ reply: "Sorry, I couldn't process your request." });
    }
});

module.exports = router;
