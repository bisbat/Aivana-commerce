export interface CreateSellerProfileDto {
  bio: string;
  storeName: string;
  location: string;

  skills: string[];

  totalProducts: number;
  totalSales: number;
  averageRating: number;
  totalReviews: number;

  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    github?: string;
    [key: string]: string | undefined;
  };

  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}
