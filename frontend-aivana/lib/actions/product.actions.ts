"use server";
import { revalidatePath } from 'next/cache';

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
