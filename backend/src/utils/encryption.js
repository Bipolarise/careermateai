// Shared AES-256-GCM helpers for encrypting PII at rest (see security.md).
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV, the size GCM is designed for

function getKey() {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('ENCRYPTION_KEY environment variable is required to encrypt/decrypt PII');
  }
  // Derive a 32-byte key from whatever secret is configured, so ENCRYPTION_KEY
  // can be any passphrase length rather than requiring an exact 32-byte value.
  return crypto.createHash('sha256').update(secret).digest();
}

// iv:authTag:ciphertext, each base64 — the format decrypt() expects back.
export function encrypt(plaintext) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((buf) => buf.toString('base64')).join(':');
}

export function decrypt(payload) {
  const [ivB64, authTagB64, ciphertextB64] = payload.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

// AES-GCM ciphertext is non-deterministic (random IV per call), so it can't be
// queried directly. This produces a deterministic HMAC "blind index" of the
// normalized value for exact-match lookups (e.g. finding a user by email).
export function hashForLookup(value) {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('ENCRYPTION_KEY environment variable is required to hash PII for lookup');
  }
  return crypto
    .createHmac('sha256', secret)
    .update(String(value).trim().toLowerCase())
    .digest('hex');
}
