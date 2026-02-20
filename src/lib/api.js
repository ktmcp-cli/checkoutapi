/**
 * API Client Module
 *
 * HTTP client for Checkout.com API with error handling and rate limiting
 */

import axios from 'axios';
import chalk from 'chalk';
import { getAuthHeaders } from './auth.js';
import { getBaseUrl } from './config.js';

/**
 * Create configured axios instance
 * @param {boolean} usePublicKey - Use public key instead of secret key
 * @returns {Object} Axios instance
 */
function createApiClient(usePublicKey = false) {
  const baseURL = getBaseUrl();

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: getAuthHeaders(usePublicKey),
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 401:
            throw new Error('Authentication failed. Check your API key.');
          case 403:
            throw new Error('Access denied. Insufficient permissions.');
          case 404:
            throw new Error('Resource not found.');
          case 422:
            throw new Error(
              `Validation error: ${JSON.stringify(data.error_codes || data, null, 2)}`
            );
          case 429:
            const retryAfter = error.response.headers['retry-after'];
            throw new Error(
              `Rate limit exceeded. Retry after ${retryAfter} seconds.`
            );
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(
              `API error (${status}): ${JSON.stringify(data, null, 2)}`
            );
        }
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server. Check your connection.');
      } else {
        // Error setting up request
        throw new Error(`Request error: ${error.message}`);
      }
    }
  );

  return client;
}

/**
 * Make GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {boolean} usePublicKey - Use public key for auth
 * @returns {Promise<Object>} Response data
 */
export async function get(endpoint, params = {}, usePublicKey = false) {
  const client = createApiClient(usePublicKey);
  const response = await client.get(endpoint, { params });
  return response.data;
}

/**
 * Make POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @param {boolean} usePublicKey - Use public key for auth
 * @returns {Promise<Object>} Response data
 */
export async function post(endpoint, data = {}, usePublicKey = false) {
  const client = createApiClient(usePublicKey);
  const response = await client.post(endpoint, data);
  return response.data;
}

/**
 * Make PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export async function put(endpoint, data = {}) {
  const client = createApiClient();
  const response = await client.put(endpoint, data);
  return response.data;
}

/**
 * Make PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export async function patch(endpoint, data = {}) {
  const client = createApiClient();
  const response = await client.patch(endpoint, data);
  return response.data;
}

/**
 * Make DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} Response data
 */
export async function del(endpoint) {
  const client = createApiClient();
  const response = await client.delete(endpoint);
  return response.data;
}

/**
 * Format output for CLI display
 * @param {*} data - Data to format
 * @param {string} format - Output format (json, pretty)
 * @returns {string} Formatted output
 */
export function formatOutput(data, format = 'pretty') {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // Pretty print for terminal
  if (Array.isArray(data)) {
    return data.map((item, idx) => {
      return `${chalk.cyan(`[${idx}]`)} ${JSON.stringify(item, null, 2)}`;
    }).join('\n\n');
  }

  return JSON.stringify(data, null, 2);
}
