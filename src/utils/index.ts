import { ENV_CONFIG } from "@config/envConfig";
import CryptoJS from "crypto-js";

export const encrypt = (data: string) => {
  const secretKey = ENV_CONFIG.SECRET_KEY;
  if (!secretKey) throw "SECRET_KEY is missing in env";
  const cipherText = encodeURIComponent(
    CryptoJS.AES.encrypt(data, secretKey).toString()
  );
  return cipherText;
};

export const decrypt = (data: string) => {
  try {
    const secretKey = ENV_CONFIG.SECRET_KEY;
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


export const buildSelectedColumns = ({
  columns,
  defaultColumns = ["id", "createdAt", "updatedAt"],
}: {
  columns?: string | string[],
  defaultColumns: string[]
}): string[] => {
  if (!columns) return defaultColumns;

  let cols: string[] = [];

  if (Array.isArray(columns)) {
    cols = [...columns];
  }

  else {
    cols = [columns];
  }

  if (!cols.includes("id")) cols.push("id");
  if (!cols.includes("createdAt")) cols.push("createdAt");
  if (!cols.includes("updatedAt")) cols.push("updatedAt");

  return [...new Set(cols)];
};
