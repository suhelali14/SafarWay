/**
 * Utility functions for handling subdomains
 */

/**
 * Get the current subdomain from the hostname
 * @returns The current subdomain or null if no subdomain exists
 */
export const getCurrentSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const parts = hostname.split('.');
    if (parts.length > 1) {
      return parts[0];
    }
    return null;
  }

  // Handle production subdomains
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};

/**
 * Check if the current hostname has a subdomain
 * @returns boolean indicating if a subdomain exists
 */
export const hasSubdomain = (): boolean => {
  return getCurrentSubdomain() !== null;
};

/**
 * Get the main domain from the hostname
 * @returns The main domain without subdomain
 */
export const getMainDomain = (): string => {
  const hostname = window.location.hostname;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return hostname;
  }

  // Handle production domains
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts.slice(1).join('.');
  }
  
  return hostname;
};

/**
 * Check if the current subdomain matches the expected subdomain
 * @param expectedSubdomain The subdomain to check against
 * @returns boolean indicating if the subdomains match
 */
export const isSubdomain = (expectedSubdomain: string): boolean => {
  const currentSubdomain = getCurrentSubdomain();
  return currentSubdomain === expectedSubdomain;
};

/**
 * Redirect to a different subdomain
 * @param subdomain The target subdomain
 * @param path Optional path to append to the URL
 */
export const redirectToSubdomain = (subdomain: string, path: string = ''): void => {
  const mainDomain = getMainDomain();
  const protocol = window.location.protocol;
  const newUrl = `${protocol}//${subdomain}.${mainDomain}${path}`;
  window.location.href = newUrl;
}; 