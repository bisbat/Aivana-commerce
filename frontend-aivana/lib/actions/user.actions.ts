"use server";

export async function getSellerProfileAction(username: string) {
    // ส่งคำขอไปยัง API เพื่อดึงข้อมูลโปรไฟล์ผู้ขาย
    const res = await fetch(`http://localhost:3001/sellers/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch seller profile');
    }
    return res.json();
}

export async function updateSellerProfileAction(sellerId: string, data: {
    bio?: string;
    location?: string;
    skills?: string[];
    tools?: string[];
    socialLinks?: Record<string, string>;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
}) {
    const res = await fetch(`http://localhost:3001/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        throw new Error('Failed to update seller profile');
    }
    
    return res.json();
}