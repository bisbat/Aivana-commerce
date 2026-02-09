import {
  getSellerById,
  getSellerByUsername,
} from "@/lib/actions/seller.actions";
import { getProductsBySellerId } from "@/lib/actions/seller.actions";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SellerProfile from "./SellerProfile";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const seller = await getSellerByUsername(username);

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">ไม่พบร้านค้า</h1>
          <p className="text-gray-600 mb-4">
            ผู้ใช้ @{username} ยังไม่ได้เป็นผู้ขาย
          </p>
          <a href="/" className="text-blue-600 hover:underline">
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    );
  }

  const products = await getProductsBySellerId(seller.id);
  const dashboard = await getDashboardStats(seller.id);
  const currentUser = await getCurrentUser();

  return (
    <SellerProfile
      seller={seller}
      products={products}
      productsTotal={dashboard.productCount}
      currentUserId={currentUser?.id ? parseInt(currentUser.id) : undefined}
    />
  );
}
