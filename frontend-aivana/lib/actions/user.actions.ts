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