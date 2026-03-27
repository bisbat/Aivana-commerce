'use client';
import Script from "next/script";
import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createCreditCardToken } from '@/lib/omise';
import { createCreditCardPayment } from '@/lib/actions/payment.actions';
import { formatCardNumber, formatExpiry } from '@/lib/utils/card-format';
import { validateCardForm } from '@/lib/utils/card-validation';
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export default function CreditCardPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [omiseReady, setOmiseReady] = useState(false);

    useEffect(() => {
        handleOmiseLoad();
    }, []);

    const handleOmiseLoad = () => {
        if ((window as any).Omise) {
            (window as any).Omise.setPublicKey(
                process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY
            );
            setOmiseReady(true);
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!omiseReady) {
            setError('กรุณารอสักครู่...');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // ดึงค่าจาก form
            const name = formData.get('name') as string;
            const cardNumber = (formData.get('cc-number') as string).replace(/\s/g, ''); // ลบ space
            const expiry = formData.get('cc-expiry') as string; // MM/YY
            const cvc = formData.get('cc-cvc') as string;

            // แปลง expiry date
            const [expiryMonth, expiryYear] = expiry.split('/');
            const fullYear = `20${expiryYear.trim()}`; // 25 → 2025

            console.log('Creating token with:', {
                name,
                cardNumber: cardNumber.substring(0, 4) + '...',
                expiryMonth,
                expiryYear: fullYear,
            });

            // Validate form data
            const validationError = validateCardForm({
                cardNumber,
                expiry,
                cvc,
            });

            if (!validationError.valid) {
                setError(validationError.message);
                setLoading(false);
                return;
            }

            // สร้าง token
            const token = await createCreditCardToken({
                name,
                number: cardNumber,
                expiryMonth: expiryMonth.trim(),
                expiryYear: fullYear,
                cvc,
            });

            // สร้าง payment
            const res = await createCreditCardPayment(token.id, Number(orderId));

            if (res.status === 'successful') {
                showSuccessToast("ชำระเงินสำเร็จแล้ว ระบบกำลังส่งอีเมลยืนยัน");
                router.push(`/payment/success`);
            } else if (res.status === 'pending' && res.authorize_uri) {
                window.location.href = res.authorize_uri; // 3D secure
            } else {
                router.push(`/payment/failed`);
            }


        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('การชำระเงินล้มเหลว กรุณาตรวจสอบข้อมูลบัตร');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = formatCardNumber(e.target.value);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = formatExpiry(e.target.value);
    };

    return (
        <div className="min-h-screen  from-purple-50 to-blue-100 flex items-center justify-center p-4">
            <Script
                src="https://cdn.omise.co/omise.js"
                strategy="afterInteractive"
                onLoad={handleOmiseLoad}
                onError={() => {
                    setError('ไม่สามารถโหลดระบบชำระเงินได้ กรุณา refresh หน้าใหม่');
                }}
            />
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <svg
                            className="w-8 h-8 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        ชำระด้วยบัตรเครดิต
                    </h1>
                    <p className="text-gray-600">กรอกข้อมูลบัตรเพื่อชำระเงิน</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Cardholder Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            ชื่อผู้ถือบัตร
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder="John Doe"
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                        />
                    </div>

                    {/* Card Number */}
                    <div>
                        <label
                            htmlFor="cc-number"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            หมายเลขบัตร
                        </label>
                        <input
                            type="text"
                            id="cc-number"
                            name="cc-number"
                            required
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            onChange={handleCardNumberChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry Date */}
                        <div>
                            <label
                                htmlFor="cc-expiry"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                วันหมดอายุ
                            </label>
                            <input
                                type="text"
                                id="cc-expiry"
                                name="cc-expiry"
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                                onChange={handleExpiryChange}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                            />
                        </div>

                        {/* CVC */}
                        <div>
                            <label
                                htmlFor="cc-cvc"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                CVC
                            </label>
                            <input
                                type="text"
                                id="cc-cvc"
                                name="cc-cvc"
                                required
                                placeholder="123"
                                maxLength={4}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>กำลังดำเนินการ...</span>
                            </div>
                        ) : (
                            'ชำระเงิน'
                        )}
                    </button>
                </form>

                {/* Security Badge */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                        <span>🔒 Secured by Omise</span>
                    </div>
                </div>

            </div>
        </div>
    );
}