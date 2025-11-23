# Quick Start Guide

## ✅ Dependencies Installed Successfully!

The dependency conflict has been resolved. Here's what changed:

### Removed (Due to Compatibility Issues):
- ❌ `@tensorflow/tfjs-react-native` - Conflicted with Expo SDK 50
- ❌ `@react-native-ml-kit/text-recognition` - Can be added later
- ❌ `@react-native-firebase/*` packages - Using web Firebase SDK instead

### Current Setup:
- ✅ All core dependencies installed (1266 packages)
- ✅ Firebase (web SDK) for auth, firestore, storage
- ✅ Expo Camera for receipt photos
- ✅ React Navigation for routing
- ✅ All UI components ready

## 🚀 Next Steps

### 1. Configure Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project (FREE - no credit card needed)
3. Enable Authentication:
   - Click "Authentication" → "Get Started"
   - Enable "Email/Password" sign-in method
4. Create Firestore Database:
   - Click "Firestore Database" → "Create database"
   - Start in "Test mode"
5. Enable Storage:
   - Click "Storage" → "Get started"
   - Use default security rules
6. Get your config:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" → Add web app
   - Copy the firebaseConfig object

### 2. Update firebase.config.js

Replace the placeholder values in `firebase.config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Run the App

```bash
npx expo start
```

Then:
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## 📱 Features Available Now

✅ **Authentication** - Email/password login and registration
✅ **Manual Transactions** - Add income and expenses
✅ **Receipt Photos** - Capture receipts (manual entry for now)
✅ **Dashboard** - View transactions and stats
✅ **Analytics** - Category breakdown and insights
✅ **Settings** - Profile and sign-out

## 🔮 Features to Add Later

- [ ] OCR text extraction (can use Google Cloud Vision API or Tesseract.js)
- [ ] ML expense predictions (TensorFlow.js when compatible version available)
- [ ] Push notifications
- [ ] Offline caching
- [ ] Interactive charts

## 💡 About OCR

The OCR feature is currently simplified:
1. User takes a photo of receipt
2. Photo is saved to Firebase Storage
3. User enters transaction details manually
4. Transaction is linked to the receipt image

**To add OCR later:**
- Option 1: Google Cloud Vision API (has free tier)
- Option 2: Tesseract.js (free, open-source)
- Option 3: expo-ocr community package

## 🐛 Troubleshooting

**If you see "Firebase not configured" error:**
- Make sure you've updated `firebase.config.js` with your actual credentials

**If camera doesn't work:**
- Grant camera permissions when prompted
- Camera may not work in iOS Simulator (use physical device)

**If app won't start:**
```bash
# Clear cache and restart
npx expo start -c
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

---

**Ready to go!** Just configure Firebase and run `npx expo start` 🚀
