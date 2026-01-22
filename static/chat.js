const chatWindow = document.getElementById("chatWindow");

function addMessage(text, sender = "user") {
  const msg = document.createElement("div");

  if (sender === "user") {
    msg.className =
      "max-w-xl ml-auto bg-indigo-600 text-white p-3 rounded-xl rounded-br-none";
  } else {
    msg.className =
      "max-w-xl mr-auto bg-white text-gray-800 p-3 rounded-xl rounded-bl-none shadow";
  }

  msg.innerText = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className =
    "max-w-xs mr-auto bg-gray-200 text-gray-600 p-3 rounded-xl rounded-bl-none";
  indicator.innerText = "AI is thinking...";
  chatWindow.appendChild(indicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

// ================= ASK QUESTION =================
async function askQuestion() {
  const input = document.getElementById("questionInput");
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  addTypingIndicator();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    removeTypingIndicator();

    if (!res.ok) {
      addMessage(data.msg || "Error occurred", "ai");
      return;
    }

    addMessage(data.answer, "ai");

  } catch (err) {
    removeTypingIndicator();
    addMessage("Network error. Please try again.", "ai");
  }
}
