import { Category } from "../category";
import { Tag } from "../tag";
import { ProductImages } from "./product_images";

//product retrieve interface form back-end
export interface Product {
  id: string;
  name: string;
  uploadedFilePath: string;
  description: string;
  price: string;
  blurb: string;
  installationGuide: string;
  previewUrl: string | null;
  heroImageUrl: string | null;
  features: string[];
  compatibility: string[];
  sellerId: string;
  category: Category;
  createdAt: string;
  detailImages: ProductImages[];
  tags: Tag[];
}
