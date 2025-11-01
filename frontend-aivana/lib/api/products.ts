// Base URL for your NestJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type for product data
export interface ProductData {
  productName: string;
  blurb: string;
  category: string;
  description: string;
  features: string[];
  compatibility: string;
  tags: string[];
  price: string;
  howToUse: string;
  livePreview: string;
}

// Type for API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Product API functions
export const productAPI = {
  // Create new product
  create: async (productData: ProductData): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
};
  // Get all products
//   getAll: async (): Promise<ApiResponse<ProductData[]>> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//     }
//   },

  // Get single product by ID
//   getById: async (id: string): Promise<ApiResponse<ProductData>> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${id}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       throw error;
//     }
//   },

  // Update product
//   update: async (id: string, productData: Partial<ProductData>): Promise<ApiResponse<any>> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error updating product:', error);
//       throw error;
//     }
//   },

  // Delete product
//   delete: async (id: string): Promise<ApiResponse<any>> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       throw error;
//     }
//   },
