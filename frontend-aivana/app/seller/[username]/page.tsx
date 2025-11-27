'use client';
import { useState, useEffect } from 'react';
import { getSellerProfileAction } from '@/lib/actions/user.actions';
import { useParams } from 'next/dist/client/components/navigation';

export default function SellerProfilePage() {

    const params = useParams();
    const username = Array.isArray(params.username)
  ? params.username[0]
  : params.username;

    const [sellerProfile, setSellerProfile] = useState(null);

    useEffect(() => {
        async function fetchData(){
            if (!username) return;
            const profileData = await getSellerProfileAction(username);
            setSellerProfile(profileData);
        }
        fetchData();
    }, [username]);
    return (
        <div>
            <h1>Seller Profile Page</h1>
            <p>{sellerProfile ? JSON.stringify(sellerProfile) : 'Loading...'}</p>
        </div>
    );
}