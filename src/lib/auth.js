/**
 * Authentication Module
 *
 * Handles API key authentication for Checkout.com API
 */

import { getSecretKey, getPublicKey } from './config.js';

/**
 * Get authentication headers for API requests
 * @param {boolean} usePublicKey - Use public key instead of secret key
 * @returns {Object} Headers object with API key
 * @throws {Error} If API key is not configured
 */
export function getAuthHeaders(usePublicKey = false) {
  const apiKey = usePublicKey ? getPublicKey() : getSecretKey();

  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if format is valid
 */
export function validateApiKeyFormat(apiKey) {
  // Checkout.com API keys start with sk_ or pk_ followed by env indicator
  // Examples: sk_sbox_, sk_, pk_sbox_, pk_
  return typeof apiKey === 'string' &&
         (apiKey.startsWith('sk_') || apiKey.startsWith('pk_')) &&
         apiKey.length >= 20;
}
