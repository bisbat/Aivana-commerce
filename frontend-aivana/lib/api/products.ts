import { Product,ProductData } from '@/types/product';
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
  },
    // Create a new product
    create: async (productData: ProductData): Promise<Product> => {
      try {
        // Transform frontend data to match backend expectations
        const requestBody = {
          title: productData.productName,
          blurb: productData.blurb || '',
          category_id: parseInt(productData.category), // Assuming category is an ID
          description: productData.description || '',
          features: productData.features || [],
          installation_doc: productData.installationDoc || '',
          price: parseFloat(productData.price) || 0,
          preview_url: productData.livePreview || '',
        };
  
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
  
        const product = await response.json();
        return product;
        
      } catch (error) {
        console.error('Error creating product:', error);
        throw error;
      }
    }
}
