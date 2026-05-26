'use client'; 
import { useState } from 'react';
import type { ProductImages } from '@/lib/types/product/product_images';

interface ProductImagesProps {
    heroSrc?: string | null;
    detailImages?: ProductImages[];
}

export default function ProductImages({ heroSrc, detailImages }: ProductImagesProps) {
    const [modalImg, setModalImg] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="bg-linne-purple-hover p-4 rounded shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">ภาพฮีโร่ (Hero Image)</h3>
                {heroSrc ? (
                    <img
                        src={heroSrc}
                        alt="Hero Image"
                        className="w-full max-h-[400px] object-contain rounded shadow-lg cursor-pointer"
                        onClick={() => setModalImg(heroSrc)}
                    />
                ) : (
                    <p>ไม่มีภาพฮีโร่ที่พร้อมใช้งาน</p>
                )}
            </div>
            <div className="bg-linne-purple-hover p-4 rounded shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">ภาพรายละเอียด (Detail Images)</h3>
                {detailImages?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {detailImages.slice(0, 8).map((img) => (
                            <img
                                key={img.imageId}
                                src={Array.isArray(img.url) ? img.url[0] : img.url}
                                alt={`Detail ${img.imageId}`}
                                className="w-full h-32 object-cover rounded shadow cursor-pointer"
                                onClick={() => setModalImg(Array.isArray(img.url) ? img.url[0] : img.url)}
                            />
                        ))}
                    </div>
                ) : (
                    <p>ไม่มีภาพเพิ่มเติมที่พร้อมใช้งาน</p>
                )}
            </div>
            {modalImg && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setModalImg(null)}
                >
                    <img
                        src={modalImg}
                        alt="Full Image"
                        className="max-w-full max-h-full rounded shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}
