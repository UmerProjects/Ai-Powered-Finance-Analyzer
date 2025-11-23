import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { FIRESTORE_COLLECTIONS } from '../types/models';

/**
 * Authentication Service
 * Handles all Firebase authentication operations
 */

export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid), {
      email: user.email,
      displayName: displayName || 'User',
      currency: 'USD',
      createdAt: new Date()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userId));
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() };
    }
    return { success: false, error: 'User profile not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Google Sign-In (requires additional setup in Firebase Console)
export const signInWithGoogle = async (idToken) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;
    
    // Check if user profile exists, if not create one
    const profileResult = await getUserProfile(user.uid);
    if (!profileResult.success) {
      await setDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid), {
        email: user.email,
        displayName: user.displayName || 'User',
        currency: 'USD',
        createdAt: new Date()
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  signUp,
  signIn,
  signOut,
  getUserProfile,
  authStateListener,
  signInWithGoogle,
};
