import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Normalizes a phone number based on custom rules:
 * - Starts with '8' -> replaced with '7'
 * - Starts with '0' -> replaced with '62'
 * - Returns E.164 format (+[country][number])
 */
export const normalizePhoneNumber = (rawInput: string): string => {
  if (!rawInput) return '';
  
  let cleaned = rawInput.trim();
  
  // Apply special replacement rules
  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.substring(1);
  } else if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }

  // Ensure it starts with '+' for E.164 format
  const phoneWithPlus = cleaned.startsWith('+') ? cleaned : '+' + cleaned;
  
  try {
    const phoneNumber = parsePhoneNumberFromString(phoneWithPlus);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.format('E.164');
    }
  } catch (error) {
    console.error('Phone normalization error:', error);
  }
  
  // If parsing fails, clean it to digits and plus only
  return phoneWithPlus.replace(/[^\d+]/g, '');
};

/**
 * Checks if a phone number is valid using libphonenumber-js
 */
export const isPhoneValid = (phone: string): boolean => {
  if (!phone) return false;
  try {
    const phoneNumber = parsePhoneNumberFromString(phone.startsWith('+') ? phone : '+' + phone);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
};
