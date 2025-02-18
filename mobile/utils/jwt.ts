/* eslint-disable no-bitwise */
import { decode as decodeLib, encode as encodeLib } from 'base-64';
import { JWT_SECRET } from '../config';
import { decode as decodeJwt } from 'react-native-pure-jwt';
import { Buffer } from 'buffer';

export const JWT_EXPIRES_IN = 3600 * 24 * 2;

export const sign = (
  payload: Record<string, any>,
  privateKey: string,
  header: Record<string, any>
) => {
  const now = new Date();
  header.expiresIn = new Date(now.getTime() + header.expiresIn);
  const encodedHeader = encodeLib(JSON.stringify(header));
  const encodedPayload = encodeLib(JSON.stringify(payload));
  const signature = encodeLib(
    Array.from(encodedPayload)
      .map((item: string, key) =>
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
  const header = JSON.parse(decodeLib(encodedHeader));
  const payload = JSON.parse(decodeLib(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('Expired token');
  }

  const verifiedSignature = encodeLib(
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
    const decoded = await decodeJwt(token, key.toString());
    const currentTime = new Date().getTime() / 1000;
    // @ts-ignore
    return currentTime <= decoded.payload.exp;

  } catch (error) {
    // Token is invalid or expired
    return false;
  }
};
