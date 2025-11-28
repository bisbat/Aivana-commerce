'use client';
import { useState, useEffect } from 'react';
import { getSellerProfileAction } from '@/lib/actions/user.actions';
import { useParams } from 'next/dist/client/components/navigation';
import { sellerProfile } from '@/lib/types/user.ts/seller';
import { ProductGrid } from '@/components/home/ProductGrid';
import EditButton from './EditButton';


export default function SellerProfilePage() {

    const params = useParams();
    const username = Array.isArray(params.username)
        ? params.username[0]
        : params.username;

    const [seller, setSeller] = useState<sellerProfile | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!username) return;
            const profileData = await getSellerProfileAction(username);
            setSeller(profileData);
        }
        fetchData();
    }, [username]);

    if (!seller) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-6">
            {/* Profile Card */}
            <div className="max-w-5xl mx-auto shadow-md rounded-xl p-6 border border-[var(--linne-purple)]">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className='flex items-center gap-6'>
                        <div className="w-20 h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            {seller.user.firstName}
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                {seller.user.firstName} {seller.user.lastName}
                            </h1>
                            <p className="text-gray-500">@{seller.user.username}</p>
                            <p className="mt-2">{seller.bio}</p>

                            {/* Socials */}
                            <div className="flex gap-3 mt-3">
                                {seller.socialLinks?.portfolio && (
                                    <a
                                        href={seller.socialLinks.portfolio}
                                        className="text-[var(--primary)] hover:underline"
                                    >
                                        Portfolio
                                    </a>
                                )}
                                {seller.socialLinks?.instagram && (
                                    <a
                                        href={`https://instagram.com/${seller.socialLinks.instagram.replace(
                                            "@",
                                            ""
                                        )}`}
                                        className="text-[var(--primary)] hover:underline"
                                    >
                                        Instagram
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        {username && <EditButton username={username} />}
                    </div>
                </div>

                {/* Location */}
                <p className="mt-4 text-white">
                    📍 <span>{seller.location}</span>
                </p>

                {/* Skills & Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h3 className="font-semibold text-lg text-white">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {seller.skills?.map((skill: string) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-[var(--linne-purple)] text-white text-sm rounded-lg"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-white">
                            Tools
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {seller.tools?.map((tool: string) => (
                                <span
                                    key={tool}
                                    className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-lg"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* product grid */}
            <div className="max-w-5xl mx-auto mt-10">
                <h2 className="text-2xl font-semibold text-white mb-6">Products by {seller.user.firstName}</h2>
                {seller.products && seller.products.length > 0 ? (
                    <ProductGrid products={seller.products} />
                ) : (
                    <p className="text-gray-500">This seller has no products listed.</p>
                )}
            </div>
        </div>
    );
}