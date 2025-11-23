# AI-Powered Personal Finance Analyzer

A comprehensive mobile application built with React Native and Expo that helps users track, analyze, and predict their finances using AI-powered features.

## ✨ Features

### 📸 Receipt & Bill Scanning (OCR)
- Take photos of receipts and bills
- Automatic text extraction using **Google ML Kit** (FREE - on-device processing)
- Auto-categorization of expenses
- Receipt image storage in Firebase

### 🤖 AI/ML Financial Analysis
- Spending pattern analysis
- Monthly expense predictions using **TensorFlow.js** (FREE)
- Anomaly detection for unusual transactions
- Fraud detection capabilities

### 📊 Analytics & Dashboard
- Interactive charts and graphs using **Victory Native** (FREE)
- Monthly, weekly, and category-wise expense summaries
- Real-time spending insights
- Visual spending breakdowns

### 💰 Manual Transaction Entry
- Quick transaction entry with category selection
- Support for both income and expenses
- Date picker for transaction dates
- Custom descriptions and notes

### 🔐 User Authentication
- Firebase Authentication (FREE tier)
- Email/password sign-in
- Google Sign-in support
- Secure user data management

### 🔔 Notifications
- Push notifications for spending anomalies
- Budget limit alerts
- Spending summaries

## 🆓 100% FREE Technology Stack

All tools and services used in this project are completely FREE:

- **Expo** - Open-source React Native framework
- **Firebase Spark Plan** (NO credit card required):
  - Authentication: Unlimited users
  - Firestore: 1GB storage, 50K reads/day, 20K writes/day
  - Storage: 5GB storage, 1GB/day downloads
- **Google ML Kit** - FREE on-device OCR (no API costs)
- **TensorFlow.js** - FREE open-source ML framework
- **Victory Native** - FREE open-source charting library
- **All npm packages** - FREE and open-source

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Firebase account (free)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd "e:/Ai powered Personal Finance Analyzer"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (FREE Spark Plan - no credit card needed)
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - (Optional) Enable Google Sign-in
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
5. Enable Storage:
   - Go to Storage
   - Get started with default rules
6. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the configuration

### 4. Configure Firebase

Edit `firebase.config.js` and replace the placeholder values with your actual Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Run the App

```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

## 📱 App Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/       # Common components (Button, Input, Card)
│   └── charts/       # Chart components (Victory Native)
├── constants/        # App constants (categories, colors)
├── contexts/         # React contexts (AuthContext)
├── navigation/       # Navigation configuration
├── screens/          # App screens
│   ├── auth/        # Authentication screens
│   ├── DashboardScreen.js
│   ├── AddTransactionScreen.js
│   ├── ScanReceiptScreen.js
│   ├── AnalyticsScreen.js
│   └── SettingsScreen.js
├── services/         # Business logic and API calls
│   ├── authService.js
│   ├── firestoreService.js
│   ├── ocrService.js
│   ├── storageService.js
│   └── mlService.js
├── styles/           # Theme and global styles
├── types/            # Type definitions (JSDoc)
└── utils/            # Utility functions
```

## 🎯 Usage

### Adding Transactions Manually
1. Tap the "Add" tab
2. Select transaction type (Expense/Income)
3. Enter amount and description
4. Choose a category
5. Select date
6. Tap "Save Transaction"

### Scanning Receipts
1. Tap the "Scan" tab
2. Take a photo or choose from gallery
3. Wait for OCR processing
4. Review extracted data
5. Transaction is automatically saved

### Viewing Analytics
1. Tap the "Analytics" tab
2. View spending breakdown by category
3. See insights and trends
4. Export data (coming soon)

## 🔧 Configuration

### Categories
Edit `src/constants/categories.js` to customize expense and income categories.

### Theme
Edit `src/styles/theme.js` to customize colors, typography, and spacing.

### Currency
Default currency is USD. Users can change this in Settings (feature coming soon).

## 🧪 Testing

### Manual Testing
1. Create a test account
2. Add sample transactions
3. Scan test receipts
4. Verify data appears in Dashboard and Analytics

### OCR Testing
- Test with various receipt formats
- Check accuracy of amount extraction
- Verify auto-categorization

## 📊 Firebase Free Tier Limits

The app is designed to work within Firebase's free tier:
- **Authentication**: Unlimited users
- **Firestore**: 
  - 1GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
- **Storage**: 
  - 5GB total storage
  - 1GB/day downloads
  - 50,000 uploads/day

These limits are more than sufficient for personal use and portfolio demonstrations.

## 🚧 Roadmap

- [ ] AI/ML expense prediction implementation
- [ ] Anomaly detection algorithms
- [ ] Budget setting and tracking
- [ ] Data export functionality
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Biometric authentication
- [ ] Recurring transactions
- [ ] Bill reminders

## 🤝 Contributing

This is a portfolio project, but suggestions and improvements are welcome!

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 👨‍💻 Author

Created as a demonstration of modern mobile app development with React Native, Firebase, and AI/ML integration.

## 🙏 Acknowledgments

- **Expo** - Amazing React Native framework
- **Firebase** - Generous free tier for backend services
- **Google ML Kit** - Free on-device OCR
- **TensorFlow.js** - Open-source ML framework
- **Victory Native** - Beautiful charting library

## 📞 Support

For issues or questions:
- Check Firebase configuration
- Verify all dependencies are installed
- Ensure camera permissions are granted
- Check Expo documentation

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)

---

**Note**: This app uses only FREE and open-source technologies. No paid services or API keys required!
