import { userProfile } from "./user";
import { Product } from "../product/Product";
export interface sellerProfile{
    id: string;
    user: userProfile;
    bio?: string;
    location?: string;
    skills?: string[];
    tools?: string[];
    socialLinks?: Record<string, string>;
    products?: Product[];
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
}