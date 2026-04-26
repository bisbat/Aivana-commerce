import { Category } from "../category";
import { Tag } from "../tag";
import { ProductImages } from "./product_images";
import { Review } from "../review";

export interface Product {
  id: string;
  name: string;
  uploadedFilePath: string;
  description: string;
  price: number;
  blurb: string;
  installationGuide: string;
  previewUrl: string | null;
  apiDocUrl: string | null;
  heroImageUrl: string | null;
  features: string[];
  techstack: string[];
  requirement: string[];
  compatibility: string[];
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string;
    userId: string;
  } | null;
  category: Category;
  createdAt: string;
  detailImages: ProductImages[];
  tags: Tag[];
  hasReviewed?: boolean;
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
  isDeleted: boolean;
  isHidden: boolean;
  deletedAt?: string;
  hiddenAt?: string;
  deletionReason?: string;
}
