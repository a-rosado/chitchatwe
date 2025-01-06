'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useUser from './hooks/useUser'; // Import the useUser hook

export default function HomePage() {
  const { user, loading, handleLogin } = useUser(); // Use the custom hook
  const router = useRouter();

 // Use useEffect to handle navigation after rendering
 useEffect(() => {
  if (user) {
    router.push('/chat'); // Redirect to the chat page if logged in
  }
}, [user, router]);

if (loading) {
  return <p className="text-center text-gray-500">Loading...</p>;
}

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-white dark:text-gray-200">
      {/* App Logo */}
      <div className="mb-8">
        <Image
          src="/ChitchatweLogo.png" // Your logo path
          alt="ChitChatWe Logo"
          width={100}
          height={100}
          className="rounded-full shadow-lg"
        />
      </div>

      {/* Welcome Title */}
      <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
        Welcome to <span className="text-yellow-300 dark:text-yellow-400">ChitChatWe</span>
      </h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Connect with friends, family, and colleagues in real-time. Your conversation, your way.
      </p>

      {/* Sign In Button */}
      <button
        onClick={handleLogin} // Use the login function from the hook
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
      >
        Sign In with Google
      </button>

      {/* Toggle Dark Mode Button */}
      <button
        onClick={() => document.documentElement.classList.toggle('dark')}
        className="mt-6 text-sm underline text-gray-100 dark:text-gray-400"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}
