import crypto from "crypto";

function generateAesKey() {
  // 32 bytes = 256-bit AES key
  const key = crypto.randomBytes(32);
  console.log("AES-256 Key (base64):");
  console.log(key.toString("base64"));
}

generateAesKey();
