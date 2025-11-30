'use client';
import { getCurrentUserFromToken, getAuthData } from '@/lib/actions/auth.actions';
import { useEffect, useState } from 'react';
import { SellerProfile } from '@/lib/types/user.ts/sellerProfile';
import { getSellerById } from '@/lib/actions/seller.actions';
import { UserProfile } from '@/lib/types/user.ts/user';
import { getUserByUserId } from '@/lib/actions/user.actions';

export default function EditSellerPage() {
    const [sellerId, setSellerId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [sellerData, setSellerData] = useState<SellerProfile | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);

    useEffect(() => {
        const user = getCurrentUserFromToken();
        if (user) {
            setSellerId(user.sellerId || null);
            setUserId(user.sub || null);
        }
    }, []);

    useEffect(()=>{
        if(!sellerId) return;
        const token = getAuthData()?.accessToken;
        if(!token) return;
        async function fetchSellerData() {
            const sellerProfile = await getSellerById(sellerId, token);
            setSellerData(sellerProfile);
        }
        fetchSellerData();
    }, [sellerId]);

    useEffect(()=>{
        if(!userId) return;
        const token = getAuthData()?.accessToken;
        if(!token) return;
        async function fetchUserData() {
            const userProfile = await getUserByUserId(userId, token);
            setUserData(userProfile);
        }
        fetchUserData();
    }, [userId]);


    if (!sellerId) {
        return <div>You must be logged in to edit your profile.</div>;
    }

    return <div>Edit Seller Page</div>;
}