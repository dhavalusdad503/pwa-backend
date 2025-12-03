import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY_SECRET;

export type AESPayload = {
  iv: string; // base64
  encrypted: string; // base64 (cipherText only, tag separated)
  authTag: string; // base64
};

export const decryptPrivateKey = (encryptedBase64: string) => {
  if (!PRIVATE_KEY) throw new Error("Private key not loaded");
  const encryptedBuf = Buffer.from(encryptedBase64, "base64");
  // RSA-OAEP with SHA-256
  const aesKeyBuf = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedBuf
  );
  // aesKeyBuf is a Buffer of raw 32 bytes (for AES-256)
  return aesKeyBuf;
};

export const aesDecrypt = (payload: string, aesKeyBuffer: Buffer) => {
  if (!aesKeyBuffer) throw new Error("Missing AES key buffer");

  const decrypt = decryptPrivateKey(payload).toString("utf8");
  const payloadObj: AESPayload = JSON.parse(decrypt);

  const iv = Buffer.from(payloadObj.iv, "base64");
  const cipherText = Buffer.from(payloadObj.encrypted, "base64");
  const authTag = Buffer.from(payloadObj.authTag, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKeyBuffer, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);
  const json = decrypted.toString("utf8");
  try {
    return JSON.parse(json);
  } catch (err) {
    return json;
  }
};

export const aesEncrypt = (data: any, aesKeyBuffer: Buffer) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", aesKeyBuffer, iv);
  const bufferData = Buffer.from(JSON.stringify(data), "utf8");
  const encrypted = Buffer.concat([cipher.update(bufferData), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine iv + encrypted + authTag into single buffer
  const combined = Buffer.concat([iv, encrypted, authTag]);

  // Encode as single base64 string
  return combined.toString("base64");
};

export const generateRandomWord = (defaultLength?: number) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"; // Available characters
  let result = "";
  const length = defaultLength || Math.floor(Math.random() * 7) + 1;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length); // Get random index
    result += alphabet[randomIndex]; // Add the random letter to the result string
  }

  return result;
};
