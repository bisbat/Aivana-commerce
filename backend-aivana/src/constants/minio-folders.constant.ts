/**
 * MinIO folder structure constants
 * Centralized location for bucket folder paths
 */
export const MINIO_FOLDERS = {
  PRODUCTS: {
    /**
     * Get hero image folder for a specific product
     * @param productId - Product ID
     * @returns Path like 'products/1/hero'
     */
    HERO: (productId: number | string) => `products/${productId}/hero`,

    /**
     * Get details folder for a specific product
     * @param productId - Product ID
     * @returns Path like 'products/1/details'
     */
    DETAILS: (productId: number | string) => `products/${productId}/details`,

    /**
     * Get files folder for a specific product
     * @param productId - Product ID
     * @returns Path like 'products/1/file'
     */
    FILE: (productId: number | string) => `products/${productId}/file`,

    /**
     * Get root folder for a specific product
     * @param productId - Product ID
     * @returns Path like 'products/1'
     */
    ROOT: (productId: number | string) => `products/${productId}`,
  },
  USERS: {
    AVATARS: 'users/avatars',
  },
} as const;
