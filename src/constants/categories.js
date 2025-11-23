// Expense and Income Categories with Icons and Colors

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B', keywords: ['restaurant', 'food', 'cafe', 'dining', 'lunch', 'dinner', 'breakfast', 'mcdonald', 'kfc', 'pizza'] },
  { id: 'transport', name: 'Transportation', icon: 'car', color: '#4ECDC4', keywords: ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train'] },
  { id: 'utilities', name: 'Utilities', icon: 'flash', color: '#95E1D3', keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'utility', 'bill'] },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: '#F38181', keywords: ['amazon', 'walmart', 'target', 'shop', 'store', 'mall', 'clothing', 'fashion'] },
  { id: 'healthcare', name: 'Healthcare', icon: 'medical', color: '#AA96DA', keywords: ['hospital', 'doctor', 'pharmacy', 'medicine', 'health', 'clinic', 'dental'] },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#FCBAD3', keywords: ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'theater'] },
  { id: 'education', name: 'Education', icon: 'school', color: '#FFFFD2', keywords: ['school', 'university', 'course', 'book', 'tuition', 'education', 'training'] },
  { id: 'fitness', name: 'Fitness', icon: 'fitness', color: '#A8D8EA', keywords: ['gym', 'fitness', 'yoga', 'sports', 'exercise', 'workout'] },
  { id: 'travel', name: 'Travel', icon: 'airplane', color: '#FFAAA5', keywords: ['hotel', 'flight', 'airbnb', 'travel', 'vacation', 'trip', 'airline'] },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#B4B4B4', keywords: [] }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'cash', color: '#51CF66' },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase', color: '#74C0FC' },
  { id: 'investment', name: 'Investment', icon: 'trending-up', color: '#FFD43B' },
  { id: 'other_income', name: 'Other Income', icon: 'wallet', color: '#B4B4B4' }
];

export const TRANSACTION_TYPES = {
  EXPENSE: 'expense',
  INCOME: 'income'
};

export const getAllCategories = () => {
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
};

export const getCategoryById = (id) => {
  return getAllCategories().find(cat => cat.id === id);
};

export const categorizeMerchant = (merchantName) => {
  if (!merchantName) return null;
  
  const lowerMerchant = merchantName.toLowerCase();
  
  for (const category of EXPENSE_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (lowerMerchant.includes(keyword)) {
        return category.id;
      }
    }
  }
  
  return 'other';
};
