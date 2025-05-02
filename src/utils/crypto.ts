
/**
 * Utility functions for cryptographic operations
 */

/**
 * Hash a password using PBKDF2
 * This provides client-side hashing before sending to the server
 * Note: Server should still hash this again
 */
export async function hashPassword(password: string, email: string): Promise<string> {
  // Use email as a salt component for added security
  const encoder = new TextEncoder();
  const saltMaterial = encoder.encode(email.toLowerCase());
  
  // Create a salt using the email and a fixed secret
  const salt = await crypto.subtle.digest('SHA-256', saltMaterial);
  
  // Import the password as a key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive key bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256'
    },
    passwordKey,
    256 // 256 bits
  );
  
  // Convert to base64 string for transmission
  return bufferToBase64(derivedBits);
}

/**
 * Convert an ArrayBuffer to a Base64 string
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
