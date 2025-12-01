'use client';
import { useRouter } from "next/navigation";
export default function BackButton({ productId }: { productId: string }) {
    const router = useRouter();

    const handleBack = () => {
        router.push(`/stores/products/${productId}`);
    };

    return (
        <button onClick={handleBack} className=" text-white px-4 py-2 rounded shadow hover:text-gray-300">
            &larr; Back
        </button>
    );
}