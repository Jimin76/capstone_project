document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    function appendMessage(role, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", role === "user" ? "user-message" : "bot-message");
        messageElement.innerHTML = `<strong>${role === "user" ? "You" : "Bot"}:</strong> ${message}`;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // 자동 스크롤
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage("user", message);
        userInput.value = "";

        try {
            const response = await fetch("/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            appendMessage("bot", data.reply);
        } catch (error) {
            appendMessage("bot", "Error: Could not connect to chatbot.");
        }
    }

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
