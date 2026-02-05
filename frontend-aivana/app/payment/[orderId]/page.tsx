"use client";

import { fetchQrPromptpay } from "@/lib/actions/payment.actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const { orderId } = useParams();
  const [qrPromptpay, setQrPromptpay] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchQr = async () => {
      try {
        const data = await fetchQrPromptpay(Number(orderId));
        console.log('hi', data)
        setQrPromptpay(data.qrImageUrl!);
        setAmount(data.amount/100);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQr();
  }, [orderId]);

  if (loading) return <div>Loading payment...</div>;

  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ชำระเงิน</h1>
          <p className="text-gray-600">สแกน QR Code เพื่อชำระเงิน</p>
        </div>

        {/* QR Code Section */}
        <div className="mb-6">
          {qrPromptpay ? (
            <div className="bg-white border-4 border-blue-500 rounded-xl p-4 shadow-lg">
              <img
                src={qrPromptpay}
                alt="PromptPay QR"
                className="w-full h-auto rounded-lg"
              />
            </div>
          ) : (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-500 font-medium">QR Code ไม่พร้อมใช้งาน</p>
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-center">
          <p className="text-blue-100 text-sm font-medium mb-1">ยอดชำระ</p>
          <p className="text-white text-4xl font-bold">
            ฿{amount?.toLocaleString('th-TH') || '0'}
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            Secured by Omise
          </p>
        </div>
      </div>
    </div>
  );
}
