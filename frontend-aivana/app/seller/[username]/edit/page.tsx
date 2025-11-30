'use client';

import { getCurrentUserFromToken, getAuthData } from '@/lib/actions/auth.actions';
import { useEffect, useState } from 'react';
import { SellerProfile } from '@/lib/types/user.ts/sellerProfile';
import { getSellerById } from '@/lib/actions/seller.actions';
import { UserProfile } from '@/lib/types/user.ts/user';
import { getUserByUserId } from '@/lib/actions/user.actions';
import { updateSellerProfile } from '@/lib/actions/seller.actions';


export default function EditSellerPage() {

    const [sellerData, setSellerData] = useState<SellerProfile | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<Partial<SellerProfile>>({});

    const user = getCurrentUserFromToken();
    if (!user) return <div>Please log in to edit your seller profile.</div>;
    const token = getAuthData()?.accessToken;

    useEffect(() => {
        const user = getCurrentUserFromToken();
        const token = getAuthData()?.accessToken;

        if (!user || !token) return;

        async function load() {
            if (!user || !token || !user.sellerId) return;
            const [sellerProfile, userProfile] = await Promise.all([
                getSellerById(user.sellerId, token),
                getUserByUserId(user.sub, token),
            ]);

            setSellerData(sellerProfile);
            setUserData(userProfile);
            setFormData({
                bio: sellerProfile.bio,
                location: sellerProfile.location,
                skills: sellerProfile.skills,
                socials: sellerProfile.socials,
                bankInfo: sellerProfile.bankInfo,
            })
        }

        load();
    }, [user.sellerId, user.sub, token]);

    if (!sellerData || !userData) {
        return <div>Loading...</div>;
    }

    // Handle input changes
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };


    const handleNestedChange = (parent: string, key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...(prev[parent as keyof SellerProfile] as any), [key]: value },
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user.sellerId) return;
        if (!token) return;

        try {
            await updateSellerProfile(user.sellerId, formData, token);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Edit Seller Profile</h1>
            <form onSubmit={handleSave}>
                {/* Store Info */}
                <section className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Store Info</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Store Name</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.storeName || ''}
                                onChange={e => handleChange('storeName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.location || ''}
                                onChange={e => handleChange('location', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Bio</label>
                            <textarea
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                rows={4}
                                value={formData.bio || ''}
                                onChange={e => handleChange('bio', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Social Links</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Facebook</label>
                            <input
                                type="url"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.socials?.facebook || ''}
                                onChange={e => handleNestedChange('socials', 'facebook', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram</label>
                            <input
                                type="url"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.socials?.instagram || ''}
                                onChange={e => handleNestedChange('socials', 'instagram', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">TikTok</label>
                            <input
                                type="url"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.socials?.tiktok || ''}
                                onChange={e => handleNestedChange('socials', 'tiktok', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Bank Info */}
                <section className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Bank Info</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Bank Name</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.bankInfo?.bankName || ''}
                                onChange={e => handleNestedChange('bankInfo', 'bankName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Account Name</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.bankInfo?.accountName || ''}
                                onChange={e => handleNestedChange('bankInfo', 'accountName', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Account Number</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                value={formData.bankInfo?.accountNumber || ''}
                                onChange={e => handleNestedChange('bankInfo', 'accountNumber', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <button
                    type="submit"
                    className="px-6 py-2 border border-gray-700 rounded font-medium"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
