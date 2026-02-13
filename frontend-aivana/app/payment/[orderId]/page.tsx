"use client";

import { fetchQrPromptpay } from "@/lib/actions/payment.actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cancelPayment } from "@/lib/actions/payment.actions";

const PAYMENT_TIMEOUT = 2 * 60; // 15 นาที (วินาที)

export default function PromptpayPage() {
  const router = useRouter();

  const { orderId } = useParams();
  const [qrPromptpay, setQrPromptpay] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [isExpired, setIsExpired] = useState(false);

  // Fetch QR Code
  useEffect(() => {
    if (!orderId) return;

    let stopped = false;

    const fetchQr = async () => {
      try {
        const data = await fetchQrPromptpay(Number(orderId));
        setLoading(false);

        if (data.action === 'REDIRECT') {
          stopped = true;
          router.push(data.redirect);
          return;
        }

        if (data.action === 'SHOW_QR') {
          setQrPromptpay(data.qrImageUrl);
          setAmount(data.amount);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // initial fetch
    fetchQr();

    const interval = setInterval(() => {
      if (!stopped) fetchQr();
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);


  // Timer Countdown
  useEffect(() => {
    if (loading) return; // รอให้โหลด QR เสร็จก่อน

    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRefresh = async () => {
    router.push(`/`);
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    await cancelPayment(Number(orderId));
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลการชำระเงิน...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ชำระเงิน</h1>
          <p className="text-gray-600">สแกน QR Code เพื่อชำระเงิน</p>
        </div>

        {/* Timer */}
        <div className="mb-6 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isExpired
              ? "bg-red-100"
              : timeLeft < 300
                ? "bg-orange-100"
                : "bg-green-100"
              }`}
          >
            <svg
              className={`w-5 h-5 ${isExpired
                ? "text-red-600"
                : timeLeft < 300
                  ? "text-orange-600"
                  : "text-green-600"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className={`font-mono text-lg font-bold ${isExpired
                ? "text-red-700"
                : timeLeft < 300
                  ? "text-orange-700"
                  : "text-green-700"
                }`}
            >
              {isExpired ? "หมดเวลา" : formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mb-6 relative">
          {isExpired && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="bg-white rounded-lg p-6 text-center max-w-xs">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-3"
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  QR หมดอายุ
                </h3>
                <p className="text-gray-600 mb-4">ถูกยกเลิกออเดอร์ กดกลับเพื่อซื้อใหม่อีกครั้ง</p>
                <button
                  onClick={handleRefresh}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  กลับไปหน้าร้านค้า
                </button>
              </div>
            </div>
          )}

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
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-gray-500 font-medium">
                QR Code ไม่พร้อมใช้งาน
              </p>
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-center">
          <p className="text-blue-100 text-sm font-medium mb-1">ยอดชำระ</p>
          <p className="text-white text-4xl font-bold">
            ฿{amount?.toLocaleString("th-TH") || "0"}
          </p>
        </div>

        {/* Cancel Order Button */}
        <div className="mt-6">
          <button
            onClick={handleCancelOrder}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            ยกเลิกออเดอร์
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            🔒 Secured by Omise
          </p>
        </div>
      </div>
    </div>
  );
}