"use client";

import { useState, useEffect } from "react";
import { auth, db, signIn, signOut, updateUserPresence } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

export default function useUser() {
  const [user, loading, error] = useAuthState(auth); // Firebase authentication state
  const [userData, setUserData] = useState(null); // Firestore user data
  const [isFetching, setIsFetching] = useState(false);

  // Fetch user data from Firestore
  const fetchUserData = async (userId) => {
    setIsFetching(true);
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.warn("User document not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      const loggedInUser = await signIn();
      if (loggedInUser) {
        // Update user presence in Firestore
        await updateUserPresence(loggedInUser.uid, loggedInUser.displayName, true);
        fetchUserData(loggedInUser.uid); // Fetch user data after login
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Ensure the user is logged in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn("No user is currently logged in.");
        return; // Exit early if no user is logged in
      }
  
      // Update Firestore to set the user's presence to offline
      await updateUserPresence(currentUser.uid, currentUser.displayName, false);
  
      // Sign out the user
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Automatically fetch user data when logged in
  useEffect(() => {
    if (user && !userData) {
      fetchUserData(user.uid);
    }
  }, [user]);

  // Ensure Firestore updates complete before navigating away
  const safeLogout = async (router) => {
    try {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        // Update Firestore to mark the user as offline
        await updateUserPresence(currentUser.uid, currentUser.displayName, false);
      }
  
      // Sign out the user
      await signOut();
  
      // Redirect to the home page
      router.push("/");
    } catch (error) {
      console.error("Error during safe logout:", error);
    }
  };

  return {
    user,         // Firebase user object
    userData,     // Firestore user data
    loading,      // Firebase auth loading state
    error,        // Firebase auth error
    isFetching,   // Firestore data fetching state
    handleLogin,  // Login function
    handleLogout, // Logout function
    safeLogout,   // Logout with redirect
  };
}
