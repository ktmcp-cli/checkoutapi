/**
 * Configuration Management
 *
 * Handles API key storage and configuration using conf package
 */

import Conf from 'conf';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const config = new Conf({
  projectName: 'checkoutapi-cli',
  defaults: {
    secretKey: process.env.CHECKOUT_SECRET_KEY || '',
    publicKey: process.env.CHECKOUT_PUBLIC_KEY || '',
    environment: process.env.CHECKOUT_ENVIRONMENT || 'sandbox',
    clientId: process.env.CHECKOUT_CLIENT_ID || '',
  },
});

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getConfig(key) {
  return config.get(key);
}

/**
 * Set configuration value
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
export function setConfig(key, value) {
  config.set(key, value);
}

/**
 * Get all configuration
 * @returns {Object} All configuration values
 */
export function getAllConfig() {
  return config.store;
}

/**
 * Delete configuration value
 * @param {string} key - Configuration key
 */
export function deleteConfig(key) {
  config.delete(key);
}

/**
 * Clear all configuration
 */
export function clearConfig() {
  config.clear();
}

/**
 * Get secret key from config or environment
 * @returns {string} Secret API key
 * @throws {Error} If secret key is not configured
 */
export function getSecretKey() {
  const secretKey = getConfig('secretKey') || process.env.CHECKOUT_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'Secret key not configured. Set it with: checkoutapi config set secretKey <your-secret-key>\n' +
      'Or set CHECKOUT_SECRET_KEY environment variable.\n' +
      'Get your API keys at: https://dashboard.checkout.com/'
    );
  }

  return secretKey;
}

/**
 * Get public key from config or environment
 * @returns {string} Public API key
 */
export function getPublicKey() {
  return getConfig('publicKey') || process.env.CHECKOUT_PUBLIC_KEY || '';
}

/**
 * Get client ID from config or environment
 * @returns {string} Client ID
 */
export function getClientId() {
  return getConfig('clientId') || process.env.CHECKOUT_CLIENT_ID || '';
}

/**
 * Get environment (sandbox/production)
 * @returns {string} Environment name
 */
export function getEnvironment() {
  return getConfig('environment') || process.env.CHECKOUT_ENVIRONMENT || 'sandbox';
}

/**
 * Get base URL based on environment and client ID
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  const env = getEnvironment();
  const clientId = getClientId();

  // Extract prefix from client_id (first 8 chars without 'cli_' prefix)
  let prefix = '';
  if (clientId) {
    prefix = clientId.replace('cli_', '').substring(0, 8);
  }

  if (env === 'production') {
    return prefix ? `https://${prefix}.api.checkout.com` : 'https://api.checkout.com';
  } else {
    return prefix ? `https://${prefix}.api.sandbox.checkout.com` : 'https://api.sandbox.checkout.com';
  }
}
