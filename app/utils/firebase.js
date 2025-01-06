import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, query, orderBy, getDocs, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.warn("Google Analytics is not supported in this environment.");
  }
});
export { analytics, logEvent };

const provider = new GoogleAuthProvider();

// Enhanced Sign-In Logic
export const signIn = async (router) => {
  try {
    await signInWithPopup(auth, provider);

    // Log the login event in analytics
    if (analytics) {
      logEvent(analytics, "login", { method: "Google" });
    }

    // Redirect to /chat after successful login
    if (router) {
      router.push("/chat");
    }
  } catch (error) {
    console.error("Sign-in failed:", error);
  }
};

// Function to handle user presence
export const updateUserPresence = async (userId, displayName, isOnline) => {
  const userRef = doc(db, "users", userId);

  if (isOnline) {
    // Add or update the user document when the user is online
    await setDoc(userRef, {
      uid: userId,
      displayName: displayName || "Anonymous User",
      online: true,
      lastSeen: serverTimestamp(),
    });
  } else {
    // Update the user's document when the user is offline
    await setDoc(
      userRef,
      {
        online: false,
        lastSeen: serverTimestamp(),
      },
      { merge: true } // Merge fields if the document exists
    );
  }
};

// Function to update typing status in Firestore
export const updateTypingStatus = async (userId, isTyping) => {
  const userRef = doc(db, "users", userId);

  try {
    await updateDoc(userRef, {
      isTyping: isTyping,
    });
  } catch (error) {
    console.error("Error updating typing status:", error);
  }
};

// Sign-Out Logic
export const signOut = async () => {
  try {
    await auth.signOut();
    if (analytics) {
      logEvent(analytics, "logout");
    }
  } catch (error) {
    console.error("Sign-out failed:", error);
  }
};

// Fetch Messages from Firestore
export async function fetchMessages() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
