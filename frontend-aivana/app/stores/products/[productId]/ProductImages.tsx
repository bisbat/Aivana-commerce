'use client'; // because we need client-side state
import { useState } from 'react';

type DetailImage = {
    image_id: string | number;
    url: string;
};

interface ProductImagesProps {
    heroSrc?: string | null;
    detailImages?: DetailImage[];
}

export default function ProductImages({ heroSrc, detailImages }: ProductImagesProps) {
    const [modalImg, setModalImg] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Hero Image */}
            <div className="bg-linne-purple-hover p-4 rounded shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">Hero Image</h3>
                {heroSrc ? (
                    <img
                        src={heroSrc}
                        alt="Hero Image"
                        className="w-full max-h-[400px] object-contain rounded shadow-lg cursor-pointer"
                        onClick={() => setModalImg(heroSrc)}
                    />
                ) : (
                    <p>No hero image available.</p>
                )}
            </div>

            {/* Detail Images */}
            <div className="bg-linne-purple-hover p-4 rounded shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">Detail Images</h3>
                {detailImages?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {detailImages.slice(0, 8).map((img) => (
                            <img
                                key={img.image_id}
                                src={img.url}
                                alt={`Detail ${img.image_id}`}
                                className="w-full h-32 object-cover rounded shadow cursor-pointer"
                                onClick={() => setModalImg(img.url)}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No additional images available.</p>
                )}
            </div>

            {/* Modal */}
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
