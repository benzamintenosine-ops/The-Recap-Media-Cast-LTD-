import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseAppletConfig from "../firebase-applet-config.json";

// User provided Firebase configuration with fallback to firebase-applet-config.json
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "AIzaSyBMCdcGqZ5c_YvDeFzf11_ASpFtvLwYh9s",
  authDomain: firebaseAppletConfig.authDomain || "the-recap-media.web.app",
  projectId: firebaseAppletConfig.projectId || "the-recap-media",
  storageBucket: firebaseAppletConfig.storageBucket || "the-recap-media.firebasestorage.app",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "66171076089",
  appId: firebaseAppletConfig.appId || "1:66171076089:web:9b0bdfe43e83dae5181128",
  measurementId: firebaseAppletConfig.measurementId || "G-2TYQ7QFJZR"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
let firestoreInstance: Firestore;
try {
  if (firebaseAppletConfig.firestoreDatabaseId) {
    firestoreInstance = getFirestore(app, firebaseAppletConfig.firestoreDatabaseId);
  } else {
    firestoreInstance = getFirestore(app);
  }
} catch (e) {
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;

// Enable offline persistence gracefully if supported in browser environment
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    // Ignore errors for multi-tab or unsupported browsers
    console.log("Firestore offline persistence notice:", err.code);
  });
}

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics (supported only in client browser context)
export const analyticsPromise = typeof window !== "undefined"
  ? isSupported().then((supported) => (supported ? getAnalytics(app) : null)).catch(() => null)
  : Promise.resolve(null);
