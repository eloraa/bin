import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import sshpk from 'sshpk';
import { decrypt } from './encryption';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const JWT_EXPIRATION = '7d';
const KEYS_DIR = path.join(process.cwd(), 'keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'id_ed25519');

export interface AuthPayload {
  publicKeyFingerprint: string; // SHA-256 fingerprint of the public key
  encryptedPassphrase: string; // AES-256-GCM encrypted passphrase
  iv: string; // Initialization vector for AES
  authTag: string; // Authentication tag for GCM
  loginTime: number; // Login time in seconds since epoch
}

/**
 * Create a signed JWT with the provided authentication payload
 * @param payload Authentication data to encode in the JWT
 * @returns Signed JWT token string
 */
export async function createJWT(payload: AuthPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(JWT_EXPIRATION).setJti(nanoid()).sign(JWT_SECRET);

  return jwt;
}

/**
 * Re-verify credentials against the server's private key
 * Ensures the passphrase can still decrypt the private key
 * @param publicKeyFingerprint Expected fingerprint from JWT
 * @param passphrase Decrypted passphrase
 * @returns true if passphrase can decrypt private key and fingerprint matches
 */
async function verifyAgainstPrivateKey(publicKeyFingerprint: string, passphrase: string): Promise<boolean> {
  try {
    if (!fs.existsSync(PRIVATE_KEY_PATH)) {
      console.error('Private key not found at:', PRIVATE_KEY_PATH);
      return false;
    }

    const privateKeyPem = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

    // Try to decrypt the private key with the passphrase
    const key = sshpk.parsePrivateKey(privateKeyPem, 'pem', {
      passphrase: passphrase,
    });

    // Derive public key from decrypted private key
    const derivedPublicKey = key.toPublic();
    const derivedFingerprint = derivedPublicKey.fingerprint('sha256').toString();

    // Verify the fingerprint matches what's in the JWT
    return derivedFingerprint === publicKeyFingerprint;
  } catch (error) {
    console.error('Private key verification failed:', error);
    return false;
  }
}

/**
 * Verify and decode a JWT token, then re-validate against server's current key
 * @param token JWT token string to verify
 * @returns Decoded payload if valid and credentials match server, null otherwise
 */
export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    // Verify JWT signature and expiration
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Validate payload structure
    if (
      typeof payload.publicKeyFingerprint === 'string' &&
      typeof payload.encryptedPassphrase === 'string' &&
      typeof payload.iv === 'string' &&
      typeof payload.authTag === 'string' &&
      typeof payload.loginTime === 'number'
    ) {
      // Decrypt the passphrase
      let decryptedPassphrase: string;
      try {
        decryptedPassphrase = decrypt({
          encrypted: payload.encryptedPassphrase,
          iv: payload.iv,
          authTag: payload.authTag,
        });
      } catch (error) {
        console.error('Failed to decrypt passphrase:', error);
        return null;
      }

      // Re-verify against private key
      const isStillValid = await verifyAgainstPrivateKey(payload.publicKeyFingerprint, decryptedPassphrase);

      if (!isStillValid) {
        console.error('Credentials no longer valid for server private key');
        return null;
      }

      return payload as unknown as AuthPayload;
    }

    return null;
  } catch (error) {
    // Token invalid, expired, or tampered
    console.error('JWT verification failed:', error);
    return null;
  }
}
