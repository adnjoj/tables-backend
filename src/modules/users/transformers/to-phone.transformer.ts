import { parsePhoneNumberFromString } from 'libphonenumber-js';

const validCountries = ['US', 'UK', 'RU'];

export const ToPhone = ({ value }: any) => {
  if (typeof value !== 'string') return value;

  const parsed = parsePhoneNumberFromString(value);

  if (!parsed) return { valid: false };
  if (!validCountries.includes(parsed.country)) return { valid: false };

  return parsed.number;
};
