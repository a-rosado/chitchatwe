"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import Chat from "../components/chat";

export default function ChatPage() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!user) {
    return <p className="text-center text-gray-500">You must be logged in to view the chat.</p>;
  }

  return (
    <div className="h-screen bg-gray-100">
      {/* Pass the authenticated user's ID to the Chat component */}
      <Chat userId={user.uid} />
    </div>
  );
}
