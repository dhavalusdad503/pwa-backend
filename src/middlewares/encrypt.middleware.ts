import { aesEncrypt, generateRandomWord } from "@utils/cryptoUtils";
import logger from "@utils/logger";
import { NextFunction, Request, Response } from "express";

/**
 * Wraps res.json so API responses are encrypted when req.aesKeyBuffer exists.
 * If no AES key is present, returns plaintext JSON as normal.
 */
export function encryptResponse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const origJson = res.json.bind(res);

  res.json = function (body) {
    try {
      // If AES key present on request, encrypt outgoing response
      const aesKey = req?.aesKeyBuffer;
      if (aesKey) {
        const payload = aesEncrypt(body, aesKey);
        // Send a predictable envelope
        return origJson({ [generateRandomWord()]: payload });
      } else {
        // no AES key — respond plaintext
        return origJson(body);
      }
    } catch (err) {
      logger.error("encryptResponse failed", err);
      // fall back to plaintext error
      return origJson({ error: "Server error" });
    }
  };

  next();
}
