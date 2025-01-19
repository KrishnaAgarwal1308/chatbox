"use client";
import { useState } from "react";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        throw new Error("No response from the assistant.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error communicating with the server." },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <div
          className="p-4 h-96 overflow-y-auto border-b border-gray-300"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg text-sm max-w-xs break-words ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <strong>
                  {msg.role === "user" ? "You" : "Assistant"}:
                </strong>
                <div>{msg.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
