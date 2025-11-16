"use server";
import { revalidatePath } from 'next/cache';
import { ProductInformationForm } from '@/lib/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function updateProductAction(productId: string, updatedData: any) {
    // ส่งคำขอไปยัง API เพื่ออัปเดตข้อมูลสินค้า
    const res = await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (res.ok) {
        // 2. ✅ อัปเดตข้อมูลใน Cache
        revalidatePath(`/stores/products/${productId}`);
    }
}

export async function deleteProductAction(productId: string) {
    // ส่งคำขอไปยัง API เพื่อลบสินค้า
    const res = await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        // 2. ✅ อัปเดตข้อมูลใน Cache
        revalidatePath(`/stores/products/${productId}`);
    }
}

export async function getAllProductsAction() {
    const res = await fetch(`http://localhost:3001/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }

    throw new Error('Failed to fetch products');
}

export async function createProductMetadata(productData: ProductInformationForm) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create product: ${errorData}`);
      }
  
      const createdProduct = await response.json();
      console.log('✅ Product created:', createdProduct);
      
      return createdProduct; // Returns { id: "5", name: "...", ... }
    } catch (error) {
      console.error('❌ Error creating product metadata:', error);
      throw error;
    }
  }

  export async function uploadProductFile(productId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('file', file);
  
      const response = await fetch(`${API_BASE_URL}/products/uploaded-file`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to upload product file: ${errorData}`);
      }
  
      const result = await response.json();
      console.log('✅ Product file uploaded:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading product file:', error);
      throw error;
    }
  }

  export async function uploadHeroImage(productId: string, heroImage: File) {
    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('image', heroImage);
  
      const response = await fetch(`${API_BASE_URL}/product-images/hero`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to upload hero image: ${errorData}`);
      }
  
      const result = await response.json();
      console.log('✅ Hero image uploaded:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading hero image:', error);
      throw error;
    }
  }

  export async function uploadDetailImages(productId: string, detailImages: File[]) {
    try {
      if (detailImages.length === 0) {
        console.log('⚠️ No detail images to upload');
        return { message: 'No images provided', total_images: 0 };
      }
  
      const formData = new FormData();
      formData.append('product_id', productId);
      
      // Append all images
      detailImages.forEach((image) => {
        formData.append('images', image);
      });
  
      const response = await fetch(`${API_BASE_URL}/product-images/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to upload detail images: ${errorData}`);
      }
  
      const result = await response.json();
      console.log('✅ Detail images uploaded:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading detail images:', error);
      throw error;
    }
  }

  
  export async function createCompleteProduct(
    productData: ProductInformationForm,
    productFile: File | null,
    heroImage: File | null,
    detailImages: File[]
  ) {
    try {
      // 1️⃣ Create product metadata first
      const createdProduct = await createProductMetadata(productData);
      const productId = createdProduct.id;
  
      // 2️⃣ Upload product file if exists
      if (productFile) {
        await uploadProductFile(productId, productFile);
      }
  
      // 3️⃣ Upload hero image if exists
      if (heroImage) {
        await uploadHeroImage(productId, heroImage);
      }
  
      // 4️⃣ Upload detail images if exist
      if (detailImages.length > 0) {
        await uploadDetailImages(productId, detailImages);
      }
  
      // ✅ Revalidate cache
      revalidatePath('/stores/products');
  
      return createdProduct;
    } catch (error) {
      console.error('❌ Error in complete product creation:', error);
      throw error;
    }
  }