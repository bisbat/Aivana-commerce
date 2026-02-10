"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {

    const router = useRouter();

    const handleGoBack = () => {
        router.push(`/`);
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-red-600 mb-4">การชำระเงินล้มเหลว</h1>
            <p className="text-lg text-white">ขออภัย ไม่สามารถประมวลผลการชำระเงินของคุณได้ หรือ คุณยกเลิกการชำระเงิน</p>
            <p className="text-lg text-white">กรุณาลองอีกครั้ง</p>
            <button onClick={handleGoBack} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300">
                กลับไปยังหน้าร้านค้า
            </button>
        </div>
    );
}