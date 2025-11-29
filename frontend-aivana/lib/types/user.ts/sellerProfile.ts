import { userProfile } from "./user";

export interface SellerProfile {
  id: string;
  user: userProfile;
  storeName: string;
  bio: string;
  location: string;

  totalProducts: number;
  totalSales: number;
  averageRating: number;
  totalReviews: number;

  skills: string[];
  socials: SocialLink;

  bankInfo: BankInfo;

  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  tiktok?: string;
  facebook?: string;
  instagram?: string;
}

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
}
