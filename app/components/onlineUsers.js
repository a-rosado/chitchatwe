"use client";

import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("online", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOnlineUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-gray-100 border-b">
      <h2 className="text-lg font-semibold text-black">Online Users</h2>
      <ul className="mt-2">
        {onlineUsers.map((user) => (
          <li key={user.id} className="py-2 px-3 bg-white rounded shadow my-2">
            {user.displayName || "Anonymous User"}
            {user.isTyping && <span className="text-sm text-blue-500"> is typing...</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
