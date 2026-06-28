import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || ""
};

// Only initialize if API key is present
let app;
let db: any = null;
let auth: any = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase API Key is missing. Firebase features will not work.");
}

export { db, auth };
