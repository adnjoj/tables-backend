import { parsePhoneNumberFromString } from 'libphonenumber-js';

const validCountries = ['US', 'UK', 'RU'];

export const ToPhone = ({ value }: any) => {
  if (typeof value !== 'string') return null;

  const parsed = parsePhoneNumberFromString(value);

  if (!parsed) return null;
  if (!validCountries.includes(parsed.country)) return null;

  return parsed.number;
};
