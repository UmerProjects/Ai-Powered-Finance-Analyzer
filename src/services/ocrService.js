/**
 * OCR Service - Simplified Version
 * 
 * Note: This is a simplified version without ML Kit OCR.
 * For production use, you can add OCR functionality using:
 * 1. Google Cloud Vision API (paid, but has free tier)
 * 2. Tesseract.js (free, but slower)
 * 3. expo-ocr (community package)
 * 
 * Current implementation: Manual entry after photo capture
 */

import { categorizeMerchant } from '../constants/categories';

/**
 * Placeholder for OCR text extraction
 * In production, integrate with an OCR service
 */
export const extractTextFromImage = async (imageUri) => {
  // Placeholder - would call OCR API here
  return { 
    success: false, 
    error: 'OCR not configured. Please enter transaction details manually.',
    text: '', 
    blocks: [] 
  };
};

/**
 * Parse receipt data from extracted text
 * This function can be used when OCR is implemented
 */
export const parseReceiptData = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  // Extract amount (look for currency symbols and numbers)
  let amount = null;
  const amountRegex = /[\$€£¥]\s*(\d+[.,]\d{2})|(\d+[.,]\d{2})\s*[\$€£¥]/g;
  const amounts = [];
  
  lines.forEach(line => {
    const matches = line.match(amountRegex);
    if (matches) {
      matches.forEach(match => {
        const num = parseFloat(match.replace(/[^\d.]/g, ''));
        if (!isNaN(num) && num > 0) {
          amounts.push(num);
        }
      });
    }
  });
  
  // Usually the largest amount is the total
  if (amounts.length > 0) {
    amount = Math.max(...amounts);
  }
  
  // Extract date (look for common date patterns)
  let date = new Date();
  const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      try {
        const parsedDate = new Date(match[0]);
        if (parsedDate instanceof Date && !isNaN(parsedDate)) {
          date = parsedDate;
          break;
        }
      } catch (e) {
        // Continue searching
      }
    }
  }
  
  // Extract merchant name (usually in first few lines)
  let merchantName = '';
  if (lines.length > 0) {
    merchantName = lines[0];
  }
  
  // Auto-categorize based on merchant name
  const category = categorizeMerchant(merchantName) || 'other';
  
  return {
    amount,
    date,
    merchantName,
    category,
    rawText: text,
    confidence: amount ? 0.7 : 0.3,
  };
};

/**
 * Process receipt image
 * Currently returns a placeholder response
 * User will need to enter details manually
 */
export const processReceiptImage = async (imageUri) => {
  // For now, return a response indicating manual entry is needed
  return { 
    success: false, 
    error: 'Please enter transaction details manually. OCR can be added later.',
    data: {
      amount: null,
      date: new Date(),
      merchantName: '',
      category: 'other',
      confidence: 0
    }
  };
};

export default {
  extractTextFromImage,
  parseReceiptData,
  processReceiptImage,
};
