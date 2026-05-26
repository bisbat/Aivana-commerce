export const 
MINIO_FOLDERS = {
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
     * Get uploaded files folder for a specific product (actual product files)
     * @param productId - Product ID
     * @returns Path like 'products/1/upload'
     */
    UPLOAD: (productId: number | string) => `products/${productId}/upload`,

    /**
     * Get root folder for a specific product
     * @param productId - Product ID
     * @returns Path like 'products/1'
     */
    ROOT: (productId: number | string) => `products/${productId}`,
  },
  USERS: {
    /**
     * Get avatars folder for a specific user
     * @param userId - User ID
     * @returns Path like 'users/{userId}/avatars'
     */
    AVATARS: (userId: number | string) => `users/${userId}/avatars`,
  },
  PAYOUT: {
  /**
   * Folder สำหรับเก็บสลิปของ payout
   * path: payouts/{payoutId}/slip
   */
  SLIP: (payoutId: number | string) => `payouts/${payoutId}/slip`,
}
} as const;
