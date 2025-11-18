"use server";
import { revalidatePath } from 'next/cache';
import { CreateProductTagsDTO } from '../types/product/product_tags';

export async function createTagAction(tagData: CreateProductTagsDTO) {
    // ส่งคำขอไปยัง API เพื่อสร้างแท็กใหม่
    const res = await fetch(`http://localhost:3001/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
    });
    revalidatePath('/tags');
}

export async function getAllTagsAction() {
    const res = await fetch(`http://localhost:3001/tags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}