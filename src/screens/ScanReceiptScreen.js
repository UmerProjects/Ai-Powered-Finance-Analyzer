import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { uploadReceiptImage } from '../services/storageService';
import { addTransaction } from '../services/firestoreService';
import { TRANSACTION_TYPES, EXPENSE_CATEGORIES } from '../constants/categories';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const ScanReceiptScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  // Manual entry fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowManualEntry(true);
    }
  };

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to scan receipts');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowManualEntry(true);
    }
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description');
      return;
    }

    setProcessing(true);
    
    // Upload image to Firebase Storage
    const uploadResult = await uploadReceiptImage(user.uid, image);
    
    if (!uploadResult.success) {
      setProcessing(false);
      Alert.alert('Upload Failed', 'Could not upload receipt image');
      return;
    }

    // Save transaction
    const transactionData = {
      type: TRANSACTION_TYPES.EXPENSE,
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date: new Date(),
      receiptUrl: uploadResult.url,
      isManual: false,
    };

    const saveResult = await addTransaction(user.uid, transactionData);
    setProcessing(false);

    if (saveResult.success) {
      Alert.alert(
        'Success',
        'Transaction saved with receipt!',
        [
          {
            text: 'OK',
            onPress: () => {
              setImage(null);
              setShowManualEntry(false);
              setAmount('');
              setDescription('');
              navigation.navigate('Dashboard');
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Could not save transaction');
    }
  };

  if (showManualEntry && image) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imagePreview}>
          <Image source={{ uri: image }} style={styles.previewImage} />
        </View>

        <View style={styles.form}>
          <Text style={styles.infoText}>
            📸 Receipt captured! Please enter transaction details:
          </Text>

          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryButton, category === cat.id && styles.categoryButtonActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Ionicons name={cat.icon} size={24} color={category === cat.id ? '#FFF' : cat.color} />
                <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, processing && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={processing}
          >
            <Text style={styles.saveButtonText}>
              {processing ? 'Saving...' : 'Save Transaction'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setImage(null);
              setShowManualEntry(false);
              setAmount('');
              setDescription('');
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="receipt-outline" size={80} color={colors.primary} />
        <Text style={styles.title}>Scan Receipt</Text>
        <Text style={styles.subtitle}>
          Take a photo of your receipt and enter the transaction details
        </Text>
        
        <Text style={styles.note}>
          💡 Note: OCR auto-extraction can be added later. For now, you'll enter details manually after capturing the receipt.
        </Text>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Ionicons name="camera" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={pickImage}>
          <Ionicons name="images" size={24} color={colors.primary} />
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  note: {
    ...typography.bodySmall,
    color: colors.info,
    marginTop: spacing.lg,
    textAlign: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    width: '100%',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    padding: spacing.lg,
  },
  infoText: {
    ...typography.body,
    color: colors.success,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  categoryScroll: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default ScanReceiptScreen;
