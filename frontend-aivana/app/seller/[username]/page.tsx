import { getSellerById } from "@/lib/actions/seller.actions";
import { getProductsBySellerId } from "@/lib/actions/seller.actions";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { redirect } from "next/navigation";
import SellerProfile from "./SellerProfile";
import { getCurrentUser } from "@/lib/auth";

export default async function SellerProfilePage() {
  const user = await getCurrentUser();
  if (!user || !user.sellerId) {
    redirect("/login");
  }
  const sellerId = user.sellerId;
  const seller = await getSellerById(sellerId);
  const products = await getProductsBySellerId(sellerId);
  const dashboard = await getDashboardStats(sellerId);


  if (!seller) return <div>Loading...</div>;

  return (
    <SellerProfile
      seller={seller}
      products={products}
      productsTotal={dashboard.productCount}
    />
  );
}
