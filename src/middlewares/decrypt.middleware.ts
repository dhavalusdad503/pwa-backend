import { aesDecrypt, decryptPrivateKey } from "@utils/cryptoUtils";
import logger from "@utils/logger";
import { NextFunction, Request, Response } from "express";

export function decryptRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const encAesKey = req.headers["x-aes-key"] || req.body?.encryptedAesKey;

    if (!encAesKey) {
      return res.status(500).json({ error: "Internal Server error" });
    }

    // Decrypt AES key
    let aesKeyBuffer;
    try {
      aesKeyBuffer = decryptPrivateKey(encAesKey);
    } catch (err) {
      logger.error("decryptRequest: failed to decrypt AES key", err);
      return res.status(400).json({ error: "Invalid encrypted key" });
    }

    req.aesKeyBuffer = aesKeyBuffer;

    // if (!!req.headers.authorization) {
    //   try {
    //     const plaintextObj = aesDecrypt(
    //       req.headers.authorization,
    //       aesKeyBuffer
    //     );
    //     req.headers.authorization = plaintextObj.token;
    //   } catch (err) {
    //     logger.error("decryptRequest failed using AES", err);
    //     return res.status(400).json({ error: "Invalid encrypted payload" });
    //   }
    // }

    if (!!Object?.keys(req?.query)?.length) {
      const params = req.query;
      const values = Object.values(params)[0] as string;
      try {
        const plaintextObj = aesDecrypt(values, aesKeyBuffer);
        req.query = plaintextObj;
      } catch (err) {
        logger.error("decryptRequest failed using AES", err);
        return res.status(400).json({ error: "Invalid encrypted payload" });
      }
    }

    if (!!Object?.keys(req?.body)?.length) {
      const payload = req.body;
      const values = Object.values(payload)[0] as string;
      try {
        const plaintextObj = aesDecrypt(values, aesKeyBuffer);
        req.body = plaintextObj;
      } catch (err) {
        logger.error("decryptRequest failed using AES", err);
        return res.status(400).json({ error: "Invalid encrypted payload" });
      }
    }
    return next();
  } catch (err) {
    logger.error("decryptRequest failed", err);
    return res.status(500).json({ error: "Internal Server error" });
  }
}
