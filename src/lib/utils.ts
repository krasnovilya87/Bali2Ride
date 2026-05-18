import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumberWithError } from 'libphonenumber-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const countryToLanguage: Record<string, string> = {
  'RU': 'Russian',
  'UA': 'Ukrainian',
  'ID': 'Indonesian',
  'US': 'English',
  'GB': 'English',
  'DE': 'German',
  'FR': 'French',
  'ES': 'Spanish',
  'IT': 'Italian',
  'IN': 'Hindi/English',
  'VN': 'Vietnamese',
  'TH': 'Thai',
  'MY': 'Malay',
  'SG': 'English',
  'AU': 'English',
  'CA': 'English',
  'CN': 'Chinese',
  'JP': 'Japanese',
  'KR': 'Korean',
  'BR': 'Portuguese',
  'TR': 'Turkish',
  'PL': 'Polish',
  'KZ': 'Russian/Kazakh',
  'BY': 'Russian/Belarusian',
  'AE': 'Arabic',
  'SA': 'Arabic',
};

const countryNames: Record<string, string> = {
  'RU': 'Russia',
  'UA': 'Ukraine',
  'ID': 'Indonesia',
  'US': 'USA',
  'GB': 'UK',
  'DE': 'Germany',
  'FR': 'France',
  'ES': 'Spain',
  'IT': 'Italy',
  'IN': 'India',
  'VN': 'Vietnam',
  'TH': 'Thailand',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'AU': 'Australia',
  'CA': 'Canada',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'BR': 'Brazil',
  'TR': 'Turkey',
  'PL': 'Poland',
  'KZ': 'Kazakhstan',
  'BY': 'Belarus',
  'AE': 'UAE',
  'SA': 'Saudi Arabia',
};

export function formatPrice(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getPhoneInfo(phone: string) {
  if (!phone) return null;
  try {
    // libphonenumber-js needs a leading + if it's international
    const normalizedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');
    const phoneNumber = parsePhoneNumberWithError(normalizedPhone);
    const country = phoneNumber.country;
    if (country) {
      return {
        countryCode: country,
        countryName: countryNames[country] || country,
        language: countryToLanguage[country] || 'Unknown',
      };
    }
  } catch (e) {
    // If it fails, try to look at prefix manually for common ones if not + format
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('7')) return { countryCode: 'RU', countryName: 'Russia', language: 'Russian' };
    if (digits.startsWith('62')) return { countryCode: 'ID', countryName: 'Indonesia', language: 'Indonesian' };
  }
  return null;
}
