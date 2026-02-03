"use client";

import { fetchQrPromptpay } from "@/lib/actions/payment.actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const { orderId } = useParams();
  const [qrPromptpay, setQrPromptpay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchQr = async () => {
      try {
        const data = await fetchQrPromptpay(Number(orderId));
        console.log('hi', data)
        setQrPromptpay(data.qrImageUrl!);
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
    <div>
      <h1>Payment page</h1>

      {qrPromptpay ? (
        <img src={qrPromptpay} alt="PromptPay QR" />
      ) : (
        <p>QR not available</p>
      )}
    </div>
  );
}
