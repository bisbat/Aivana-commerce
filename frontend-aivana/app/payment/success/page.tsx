'use client';

import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.push(`/collections`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <h1 className="text-4xl font-bold text-green-600 mb-4">การชำระเงินสำเร็จ</h1>
            <p className="text-lg text-white">ไปดูสินค้าได้ที่คอลเลกชันของคุณ</p>
            <button onClick={handleGoBack} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                ไปยังคอลเลกชัน
            </button>
        </div>
    );
}