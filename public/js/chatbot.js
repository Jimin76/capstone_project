document.addEventListener("DOMContentLoaded", function () {
    const chatbotButton = document.getElementById("chatbot-button");
    const chatbox = document.getElementById("chatbox");
    const closeChat = document.getElementById("close-chat");
    const chatContent = document.getElementById("chat-content");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // ✅ 챗봇 버튼 클릭 시 채팅창 열기
    chatbotButton.addEventListener("click", function () {
        chatbox.style.display = "flex";
    });

    // ✅ 닫기 버튼 클릭 시 채팅창 숨기기
    closeChat.addEventListener("click", function () {
        chatbox.style.display = "none";
    });

    function appendMessage(role, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", role === "user" ? "user-message" : "bot-message");
        messageElement.innerHTML = `<strong>${role === "user" ? "You" : "Bot"}:</strong> ${message}`;
        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight; // 자동 스크롤
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        appendMessage("user", message);
        chatInput.value = "";

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

    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
