import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { analytics, logEvent } from './firebase';

// Function to send a message to Firestore
export const sendMessage = async (text, userId) => {
  try {
    const messagesRef = collection(db, 'messages');
    await addDoc(messagesRef, {
      text,
      userId,
      timestamp: new Date(),
    });

    // Log "message_sent" event
    if (analytics) {
      logEvent(analytics, 'message_sent', {
        content: text,
        user_id: userId,
      });
    }
  } catch (error) {
    console.error('Message sending failed', error);
  }
};

// Function to subscribe to messages in Firestore
export const subscribeToMessages = (callback) => {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
};
