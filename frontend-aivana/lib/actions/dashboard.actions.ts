"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getDashboardStats(
    sellerId: string,
    token: string
): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }

    return response
}