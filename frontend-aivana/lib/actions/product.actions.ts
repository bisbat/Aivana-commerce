"use server";
import { revalidatePath } from 'next/cache';
import { ProductInformationFormData } from '../types/formCreateProduct/ProductInformationFormData';
import { UploadFileFormData } from '../types/formCreateProduct/UploadFileFormData'; 
import { ProductImages } from '../types/product/product_images';  


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

export async function createCompleteProduct(
    uploadFileData: UploadFileFormData,      // Step 1 data
    productInfoData: ProductInformationFormData, // Step 2 data
    imageData: ProductImages                 // Step 3 data
) {
    try {
        // Create FormData with ALL information
        const formData = new FormData();

        // Step 2: Product Information (metadata)
        formData.append('name', productInfoData.name);
        formData.append('description', productInfoData.description);
        formData.append('price', productInfoData.price.toString());
        formData.append('blurb', productInfoData.blurb);
        formData.append('installation_guide', productInfoData.installation_guide);
        formData.append('preview_url', productInfoData.preview_url || '');
        formData.append('categoryId', productInfoData.categoryId.toString());
        formData.append('ownerId', productInfoData.ownerId.toString());

        // Arrays as JSON strings
        formData.append('features', JSON.stringify(productInfoData.features));
        formData.append('compatibility', JSON.stringify(productInfoData.compatibility));
        formData.append('tagIds', JSON.stringify(productInfoData.tagIds));

        // Step 1: Product File (.zip, .fig, etc.)
        if (uploadFileData.file) {
            formData.append('productFile', uploadFileData.file);
        }

        // Step 3: Hero Image
        if (imageData.heroImage) {
            formData.append('heroImage', imageData.heroImage);
        }

        // Step 3: Detail Images (multiple files)
        if (imageData.detailImages.length > 0) {
            imageData.detailImages.forEach((image) => {
                formData.append('detailImages', image);
            });
        }

        console.log('📤 Sending complete product to backend...');

        // ✨ Single API call with everything
        const response = await fetch(`${API_BASE_URL}/products/with-files`, {
            method: 'POST',
            body: formData,
            // No Content-Type header - browser sets it automatically for FormData
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to create product: ${errorData}`);
        }

        const createdProduct = await response.json();
        console.log('✅ Product created successfully:', createdProduct);

        // Revalidate cache
        revalidatePath('/stores/products');

        return createdProduct;

    } catch (error) {
        console.error('❌ Error creating complete product:', error);
        throw error;
    }
}