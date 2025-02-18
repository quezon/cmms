import * as jose from 'jose';
import { Buffer } from 'buffer';
import { JWT_SECRET } from '../config';

window.Buffer = Buffer;
/* eslint-disable no-bitwise */
export const JWT_EXPIRES_IN = 3600 * 24 * 14;

export const sign = (
  payload: Record<string, any>,
  privateKey: string,
  header: Record<string, any>
) => {
  const now = new Date();
  header.expiresIn = new Date(now.getTime() + header.expiresIn);
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)
        )
      )
      .join('')
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decode = (token: string): any => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('Expired token');
  }

  const verifiedSignature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ JWT_SECRET[key % JWT_SECRET.length].charCodeAt(0)
        )
      )
      .join('')
  );

  if (verifiedSignature !== signature) {
    throw new Error('Invalid signature');
  }

  return payload;
};

export const verify = async (
  token: string,
  secretKey: string
): Promise<boolean> => {
  try {
    const key = Buffer.from(secretKey, 'base64');
    const decoded = await jose.jwtVerify(token, key);
    const currentTime = new Date().getTime() / 1000;
    return currentTime <= decoded.payload.exp;
  } catch (error) {
    // Token is invalid or expired
    return false;
  }
};
