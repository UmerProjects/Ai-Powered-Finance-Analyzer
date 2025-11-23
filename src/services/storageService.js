import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase.config';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Firebase Storage Service
 * Handles receipt image uploads to Firebase Storage (FREE tier)
 */

export const compressImage = async (imageUri) => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1024 } }], // Resize to max width of 1024px
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return { success: true, uri: manipResult.uri };
  } catch (error) {
    return { success: false, error: error.message, uri: imageUri };
  }
};

export const uploadReceiptImage = async (userId, imageUri) => {
  try {
    // Compress image first
    const compressResult = await compressImage(imageUri);
    const finalUri = compressResult.success ? compressResult.uri : imageUri;
    
    // Convert image to blob
    const response = await fetch(finalUri);
    const blob = await response.blob();
    
    // Generate unique filename
    const filename = `receipts/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, url: downloadURL, path: filename };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteReceiptImage = async (imagePath) => {
  try {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  compressImage,
  uploadReceiptImage,
  deleteReceiptImage,
};
