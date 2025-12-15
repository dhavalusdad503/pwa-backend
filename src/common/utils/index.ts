import CryptoJS from 'crypto-js';
import 'dotenv/config';

export const parseInt = (
  value: string | number | undefined | null,
): number | undefined => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmed = value.toString().trim();
  if (trimmed === '') return undefined;

  const parsed = Number.parseInt(trimmed, 10);

  return Number.isNaN(parsed) ? undefined : parsed;
};

export const successResponse = <T>(
  data: T,
  defaultMessage: string = 'Success',
) => {
  return {
    data: { ...data },
    message: defaultMessage,
  };
};

export const encrypt = (data: string) => {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) throw new Error('Secret key is missing in env');
  const cipherText = encodeURIComponent(
    CryptoJS.AES.encrypt(data, secretKey).toString(),
  );
  return cipherText;
};

export const decrypt = (data: string) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) throw new Error('Secret key is missing in env');
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(data),
      secretKey,
    ).toString(CryptoJS.enc.Utf8);
    return bytes;
  } catch {
    return null;
  }
};

export const combineName = ({
  names,
}: {
  names: (string | undefined | null)[];
}) => {
  if (!names.length) return '-';

  return names.filter((name) => name).join(' ') || '-';
};
