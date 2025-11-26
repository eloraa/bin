import fs from 'fs';
import path from 'path';
import sshpk from 'sshpk';

const KEYS_DIR = path.join(process.cwd(), 'keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'id_ed25519');

export interface VerificationResult {
  isValid: boolean;
  publicKeyFingerprint?: string;
}

export async function verifyCredentials(publicKey: string, passphrase: string): Promise<VerificationResult> {
  try {
    if (!fs.existsSync(PRIVATE_KEY_PATH)) {
      console.error('Private key not found at:', PRIVATE_KEY_PATH);
      return { isValid: false };
    }
    const privateKeyPem = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

    // Parse and decrypt the private key
    const key = sshpk.parsePrivateKey(privateKeyPem, 'pem', {
      passphrase: passphrase,
    });

    // Derive the public key from the decrypted private key
    const derivedPublicKey = key.toPublic();

    const inputKey = sshpk.parseKey(publicKey, 'ssh');

    // Compare fingerprints
    const fingerprintsMatch = derivedPublicKey.fingerprint('sha256').toString() === inputKey.fingerprint('sha256').toString();

    if (!fingerprintsMatch) {
      return { isValid: false };
    }

    // Get public key fingerprint for JWT
    const publicKeyFingerprint = inputKey.fingerprint('sha256').toString();

    return {
      isValid: true,
      publicKeyFingerprint,
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    return { isValid: false };
  }
}
