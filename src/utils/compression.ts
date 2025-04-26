import * as pako from 'pako';

/**
 * Compresses data using pako (gzip)
 * @param data Any JSON serializable data
 * @returns Base64 encoded compressed string
 */
export const compress = (data: any): string => {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Convert JSON string to Uint8Array
    const uint8Array = new TextEncoder().encode(jsonString);
    
    // Compress the Uint8Array
    const compressed = pako.deflate(uint8Array);
    
    // Convert compressed data to base64 string for storage
    return btoa(String.fromCharCode.apply(null, compressed as unknown as number[]));
  } catch (error) {
    console.error('Error compressing data:', error);
    // Fall back to uncompressed JSON if compression fails
    return JSON.stringify(data);
  }
};

/**
 * Decompresses data compressed with the compress function
 * @param compressedString Base64 encoded compressed string
 * @returns Original data object
 */
export const decompress = (compressedString: string): any => {
  try {
    // Check if it's a compressed string or regular JSON
    if (compressedString.startsWith('{') || compressedString.startsWith('[')) {
      return JSON.parse(compressedString);
    }
    
    // Convert base64 string to Uint8Array
    const binaryString = atob(compressedString);
    const uint8Array = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    // Decompress the Uint8Array
    const decompressed = pako.inflate(uint8Array);
    
    // Convert Uint8Array to string
    const jsonString = new TextDecoder().decode(decompressed);
    
    // Parse JSON string
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decompressing data:', error);
    // Try to parse as regular JSON if decompression fails
    try {
      return JSON.parse(compressedString);
    } catch {
      // Return an empty object as last resort
      return {};
    }
  }
};

/**
 * Determines if compression should be used based on payload size
 * Only compress if payload is larger than threshold
 * @param data Data to potentially compress
 * @param threshold Size threshold in bytes (default: 1KB)
 * @returns Boolean indicating if compression should be used
 */
export const shouldCompress = (data: any, threshold: number = 1024): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    return jsonString.length > threshold;
  } catch (error) {
    return false;
  }
}; 