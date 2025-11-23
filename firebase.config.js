// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDdABFFWCzwdRfka7m8g7ak0N_NpsStMTM",
  authDomain: "ai-powered-personal-fina-f5f62.firebaseapp.com",
  projectId: "ai-powered-personal-fina-f5f62",
  storageBucket: "ai-powered-personal-fina-f5f62.firebasestorage.app",
  messagingSenderId: "783486800680",
  appId: "1:783486800680:web:e25ddea9a6477bd2f9b61d"
};

// Initialize Firebase app only if it hasn't been initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;