import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export const encrypt = (data: string) => {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) throw "SECRET_KEY is missing in env";
  const cipherText = encodeURIComponent(
    CryptoJS.AES.encrypt(data, secretKey).toString()
  );
  return cipherText;
};

export const decrypt = (data: string) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) throw "SECRET_KEY is missing in env";
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(data),
      secretKey
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
  if (!names.length) return "-";

  return names.filter((name) => name).join(" ") || "-";
};
