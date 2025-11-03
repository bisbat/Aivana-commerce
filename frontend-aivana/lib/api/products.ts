import { Product } from '@/types/product';
// Base URL for your NestJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Type for API response


// Product API functions
export const productAPI = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache options if needed
        cache: 'no-store', // Always fetch fresh data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      return products;
      
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}
