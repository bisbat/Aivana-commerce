export interface CreateSellerProfileDto {
  bio: string;
  location: string;

  skills: string[];

  socials: Record<string, string>;

  bankInfo: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}
