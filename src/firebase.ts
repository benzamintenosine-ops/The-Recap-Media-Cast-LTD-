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

// Initialize Firestore with robust connection handling, multi-tab cache, and dedicated databaseId
const dbId = firebaseAppletConfig.firestoreDatabaseId;
let firestoreInstance: Firestore;

try {
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    },
    dbId
  );
} catch {
  // If already initialized or multi-tab persistence is unsupported in current iframe context
  try {
    firestoreInstance = getFirestore(app, dbId);
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
    await getDocFromServer(doc(db, 'settings', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or IndexedDB locked; persistence fallback active.');
    }
    return false;
  }
}

// Perform initial connection test
if (typeof window !== 'undefined') {
  testFirestoreConnection();
}

