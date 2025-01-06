'use client';

import { useEffect } from 'react';
import useUser from '../hooks/useUser'; // Import the useUser hook
import Chat from '../components/chat';
import { useRouter } from 'next/navigation'; // Import the router
import OnlineUsers from '../components/onlineUsers';

export default function ChatPage() {
  const { user, userData, loading, error, handleLogout } = useUser(); // Use the custom hook
  const router = useRouter();

  // Redirect to the home page if the user is not logged in
  useEffect(() => {
    if (!user && !loading) {
      console.log("User is not logged in. Redirecting to home...");
      router.push('/'); // Redirect to the home page
    }
  }, [user, loading, router]);

  // Handle logout and redirection
  const handleLogoutAndRedirect = async () => {
    try {
      if (user) {
        await handleLogout(); // Log out the user
        console.log("Logout successful. Redirecting to home...");
        router.push('/'); // Redirect to the home page
      } else {
        console.warn("No user to log out.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show a loading spinner or message while checking user state
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  // Show an error message if an error occurs
  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  // Main content when the user is logged in
  return (
    <div className="h-screen flex flex-col">
      {/* Header with User Info and Logout */}
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-black">
          Welcome, {userData?.displayName || 'User'}!
        </h2>
        <button
          onClick={handleLogoutAndRedirect} // Use the enhanced logout function
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {/* Online Users List */}
      <OnlineUsers />
      {/* Chat Component */}
      <Chat userId={user?.uid} />
    </div>
  );
}
