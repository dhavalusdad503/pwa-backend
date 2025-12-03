import { generateKeyPairSync } from "crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  // modulusLength: 2048, // increase if you want more security
  modulusLength: 4096, // increase if you want more security
  publicKeyEncoding: { type: "spki", format: "pem" },
  // privateKeyEncoding: { type: "pkcs1", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

console.log("=== PUBLIC KEY ===");
console.log(JSON.stringify(publicKey));

console.log("=== PRIVATE KEY ===");
console.log(JSON.stringify(privateKey));
