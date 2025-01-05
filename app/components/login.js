"use client";

import { auth, signInWithGoogle, signOut } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AuthButton() {
  const [user] = useAuthState(auth);

  return (
    <div className="p-4">
      {user ? (
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}
