'use client';
import { useState, useEffect } from 'react';
import { getSellerById } from '@/lib/actions/seller.actions';
import { SellerProfile } from '@/lib/types/user.ts/sellerProfile';
import EditButton from './EditButton';
import { getCurrentUserFromToken, getAuthData } from '@/lib/actions/auth.actions';
import { ProductGrid } from '@/components/home/ProductGrid';
import { getProductsBySellerId } from '@/lib/actions/seller.actions';
import { Product } from '@/lib/types/product/Product';

export default function SellerProfilePage() {
    const sellerId = getCurrentUserFromToken()?.sellerId;
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchData() {
            if (!sellerId) return;
            const token = getAuthData()?.accessToken;
            if (!token) return;

            const profileData = await getSellerById(sellerId, token);
            setSeller(profileData);

            const productsData = await getProductsBySellerId(sellerId, token);
            setProducts(productsData);
        }
        fetchData();
    }, [sellerId]);

    if (!seller) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                {/* Left section */}
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="px-3 py-1 border rounded-md text-sm text-gray-300 hover:bg-neutral-800 transition"
                    >
                        ← Back
                    </button>

                    {/* Avatar */}
                    <img
                        src={seller.user.avatarUrl || '/default-avatar.png'}
                        className="w-16 h-16 rounded-full object-cover bg-neutral-800"
                        alt="seller avatar"
                    />

                    {/* Seller Info */}
                    <div>
                        <h1 className="text-2xl font-semibold">{seller.storeName}</h1>
                        <p className="text-gray-400 text-sm">
                            {seller.user.firstName} {seller.user.lastName} • @{seller.user.username}
                        </p>
                    </div>
                </div>

                {/* Right Section Buttons */}
                <div className="flex items-center gap-3">

                    {/* Contact Button */}
                    <button className="px-4 py-2 text-sm border rounded-md hover:bg-neutral-800 transition">
                        Contact
                    </button>

                    {/* Edit Button */}
                    <EditButton sellerId={seller.id} />
                </div>

            </div>


            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900/40">
                    <p className="text-lg font-semibold">{seller.totalProducts}</p>
                    <p className="text-gray-400 text-sm">Products</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40">
                    <p className="text-lg font-semibold">{seller.totalSales}</p>
                    <p className="text-gray-400 text-sm">Sales</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40">
                    <p className="text-lg font-semibold">{seller.averageRating}</p>
                    <p className="text-gray-400 text-sm">Rating</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/40">
                    <p className="text-lg font-semibold">{seller.totalReviews}</p>
                    <p className="text-gray-400 text-sm">Reviews</p>
                </div>
            </div>

            {/* About */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-gray-300">{seller.bio}</p>
            </div>

            {/* Skills */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex gap-2 flex-wrap">
                    {seller.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-neutral-900/60 text-gray-200 text-sm"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Socials */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Socials</h2>
                <div className="flex gap-4 text-blue-400 underline text-sm">
                    {Object.entries(seller.socials).map(([key, url]) => (
                        <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                            {key}
                        </a>
                    ))}
                </div>
            </div>

            {/* Products */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <ProductGrid products={products} />
            </div>
        </div>
    );
}