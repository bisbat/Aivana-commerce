"use server";
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function updateProductAction(productId: string, updatedData: any) {
    // ส่งคำขอไปยัง API เพื่ออัปเดตข้อมูลสินค้า
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: updatedData instanceof FormData ? {} : {
            'Content-Type': 'application/json',
        },
        body: updatedData instanceof FormData ? updatedData : JSON.stringify(updatedData),
    });

    if (res.ok) {
        // 2. ✅ อัปเดตข้อมูลใน Cache
        revalidatePath(`/stores/products/${productId}`);
        return await res.json();
    }
    
    throw new Error('Failed to update product');
}

// ฟังก์ชันสำหรับลบ detail image
export async function deleteProductImageAction(imageId: string) {
    const res = await fetch(`${API_BASE_URL}/product-images/${imageId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        revalidatePath(`/stores/products/${imageId}`);
        return await res.json();
    }
    
    throw new Error('Failed to delete image');
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

export async function getProductByIdAction(productId: string) {
    const res = await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }

    throw new Error('Failed to fetch product');
}