import { UserProfile } from "./user";

export interface SellerProfile {
  id: string;
  user: UserProfile;
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
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  github?: string;
  linkedin?: string;
};

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
}
