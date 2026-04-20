"use server";
import { SentimentStats } from "../types/sentiment/stats";
import { SentimentTrend } from "../types/sentiment/trend";
import { SentimentReview } from "../types/sentiment/reviews";
import { getAccessToken } from "../auth";
import { getCurrentUser } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchSentimentDashboardData(sellerId: string) {
    const token = await getAccessToken();
    if (!token) {
        throw new Error("Unauthorized");
    }
    const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch sentiment dashboard data");
    }
    return response.json();
}

export async function fetchSentimentStats(sellerId: string): Promise<SentimentStats> {
    const token = await getAccessToken();
    if (!token) {
        throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}/stats`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch sentiment stats");
    }
    return response.json();
}

export async function fetchSentimentTrend(sellerId: string): Promise<SentimentTrend[]> {
    const token = await getAccessToken();
    if (!token) {
        throw new Error("Unauthorized");
    }
    const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}/trend`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch sentiment trend");
    }
    return response.json();
}

export async function fetchSentimentReviews(sellerId: string): Promise<SentimentReview[]> {
    const token = await getAccessToken();
    if (!token) {
        throw new Error("Unauthorized");
    }
    const response = await fetch(`${API_BASE_URL}/dashboard/${sellerId}/reviews`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch sentiment reviews");
    }
    return response.json();
}