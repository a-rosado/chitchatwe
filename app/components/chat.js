"use client";

import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      userId,
      timestamp: serverTimestamp(),
    });
    setNewMessage(""); // Clear the input field
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto bg-gray-50 p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-3 bg-white rounded shadow my-2">
              <p className="font-semibold text-blue-600">
                {msg.userId === userId ? "You" : msg.userId}
              </p>
              <p>{msg.text}</p>
              <span className="text-xs text-gray-400">
                {msg.timestamp &&
                  new Date(msg.timestamp.seconds * 1000).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-white border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />
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
