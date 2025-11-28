import { getCurrentUserFromToken } from "./auth.actions";

export interface CreateSellerRequest {
  bio: string;
  location: string;
  skills: string[];
  tools: string[];
  socialLinks: Record<string, string>;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface SellerProfile {
  id: string;
  bio: string;
  location: string;
  skills: string[];
  tools: string[];
  socialLinks: Record<string, string>;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerInfo {
  username: string;
}

export async function becomeSeller(
  data: CreateSellerRequest
): Promise<SellerProfile> {
  const user = getCurrentUserFromToken();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `http://localhost:3001/sellers/upgrade/${user.sub}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to become seller");
  }

  return await response.json();
}
