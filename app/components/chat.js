"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { updateTypingStatus } from "../utils/firebase"; // Import the typing status function

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null); // Track typing timeout

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      alert("Message cannot be empty.");
      return;
    }

    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      userId,
      timestamp: serverTimestamp(),
    });

    setNewMessage(""); // Clear the input field
    updateTypingStatus(userId, false); // Reset typing status
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Update typing status
    updateTypingStatus(userId, true);

    // Clear the typing indicator after a delay
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(userId, false);
    }, 2000); // Reset typing after 2 seconds of inactivity
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto bg-gray-50 p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded shadow my-2 ${
                msg.userId === userId ? "bg-blue-100 text-blue-800" : "bg-white text-black"
              }`}
            >
              <p className="font-semibold text-black">{msg.userId === userId ? "You" : msg.userId}</p>
              <p>{msg.text}</p>
              <span className="text-xs text-black">
                {msg.timestamp &&
                  new Date(msg.timestamp.seconds * 1000).toLocaleString()}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping} // Handle typing
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter
            placeholder="Type your message..."
            className="text-black flex-grow px-4 py-2 border rounded focus:outline-none"
          />
        </div>
        <button
          onClick={sendMessage}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
