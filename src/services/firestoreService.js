import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { FIRESTORE_COLLECTIONS } from '../types/models';

/**
 * Firestore Service
 * Handles all database operations
 */

// Transactions
export const addTransaction = async (userId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.TRANSACTIONS), {
      ...transactionData,
      userId,
      createdAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateTransaction = async (transactionId, updates) => {
  try {
    await updateDoc(doc(db, FIRESTORE_COLLECTIONS.TRANSACTIONS, transactionId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.TRANSACTIONS, transactionId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getTransactions = async (userId, options = {}) => {
  try {
    const { startDate, endDate, category, type, limitCount = 100 } = options;
    
    let q = query(
      collection(db, FIRESTORE_COLLECTIONS.TRANSACTIONS),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    if (type) {
      q = query(q, where('type', '==', type));
    }
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    
    // Filter by date range if provided
    let filtered = transactions;
    if (startDate || endDate) {
      filtered = transactions.filter(t => {
        const transDate = t.date.toDate ? t.date.toDate() : new Date(t.date);
        if (startDate && transDate < startDate) return false;
        if (endDate && transDate > endDate) return false;
        return true;
      });
    }
    
    return { success: true, transactions: filtered };
  } catch (error) {
    return { success: false, error: error.message, transactions: [] };
  }
};

export const subscribeToTransactions = (userId, callback) => {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.TRANSACTIONS),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    callback(transactions);
  });
};

// Budgets
export const addBudget = async (userId, budgetData) => {
  try {
    const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.BUDGETS), {
      ...budgetData,
      userId,
      createdAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getBudgets = async (userId) => {
  try {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.BUDGETS),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const budgets = [];
    querySnapshot.forEach((doc) => {
      budgets.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, budgets };
  } catch (error) {
    return { success: false, error: error.message, budgets: [] };
  }
};

export default {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  subscribeToTransactions,
  addBudget,
  getBudgets,
};
