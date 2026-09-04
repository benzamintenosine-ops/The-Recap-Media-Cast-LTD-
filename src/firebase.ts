import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseAppletConfig from "../firebase-applet-config.json";

// User provided Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey,
  authDomain: firebaseAppletConfig.authDomain,
  projectId: firebaseAppletConfig.projectId,
  storageBucket: firebaseAppletConfig.storageBucket,
  messagingSenderId: firebaseAppletConfig.messagingSenderId,
  appId: firebaseAppletConfig.appId,
  measurementId: firebaseAppletConfig.measurementId || ""
};

// Initialize Firebase App safely (avoid duplicate initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with robust connection handling, dedicated databaseId, and auto-detect long polling
const dbId = firebaseAppletConfig.firestoreDatabaseId;
let firestoreInstance: Firestore;

try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true
  }, dbId || undefined);
} catch (e) {
  try {
    if (dbId) {
      firestoreInstance = getFirestore(app, dbId);
    } else {
      firestoreInstance = getFirestore(app);
    }
  } catch {
    firestoreInstance = getFirestore(app);
  }
}

export const db = firestoreInstance;

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics (supported only in client browser context)
export const analyticsPromise = typeof window !== "undefined"
  ? isSupported().then((supported) => (supported ? getAnalytics(app) : null)).catch(() => null)
  : Promise.resolve(null);

// Validate Connection to Firestore on startup (Per Firebase Integration Skill)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDoc = doc(db, 'settings', 'connection_test');
    await Promise.race([
      getDocFromServer(testDoc),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    return true;
  } catch (error) {
    // Operate seamlessly in offline/cached mode
    return false;
  }
}

// Perform initial connection probe in background
if (typeof window !== 'undefined') {
  testFirestoreConnection().catch(() => {});
}

