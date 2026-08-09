import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKVONip0-IyIaLQabI4zLfObtmfrUCUro",
  authDomain: "js-ai-assistant-66b1d.firebaseapp.com",
  projectId: "js-ai-assistant-66b1d",
  storageBucket: "js-ai-assistant-66b1d.firebasestorage.app",
  messagingSenderId: "223945266268",
  appId: "1:223945266268:web:49c8e843ef70baa04a0299",
  measurementId: "G-2MNML8WJF4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Analytics
export const analytics = getAnalytics(app);