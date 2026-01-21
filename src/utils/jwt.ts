/**
 * JWT Utilities for token management
 */

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decode a JWT token without verification
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    if (!token) return null;
    
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
};

/**
 * Get the expiration timestamp from a JWT token
 * @param token - The JWT token string
 * @returns The expiration timestamp in milliseconds, or null if not available
 */
export const getTokenExpiration = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return null;
  
  // exp is in seconds, convert to milliseconds
  return payload.exp * 1000;
};

/**
 * Check if a JWT token is expired
 * @param token - The JWT token string
 * @param bufferMs - Buffer time in milliseconds before actual expiration (default: 0)
 * @returns true if expired or invalid, false otherwise
 */
export const isTokenExpired = (token: string, bufferMs: number = 0): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  return Date.now() >= expiration - bufferMs;
};

/**
 * Get time until token expiration
 * @param token - The JWT token string
 * @returns Time in milliseconds until expiration, or 0 if expired/invalid
 */
export const getTimeUntilExpiration = (token: string): number => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;
  
  const remaining = expiration - Date.now();
  return Math.max(0, remaining);
};
