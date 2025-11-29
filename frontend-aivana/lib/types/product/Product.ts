import { Category } from "../category";
import { Tag } from "../tag";
import { ProductImages } from "./product_images";

//product retrieve interface form back-end
export interface Product {
  id: string;
  name: string;
  uploadedFilePath: string;
  description: string;
  price: number;
  blurb: string;
  installationGuide: string;
  previewUrl: string | null;
  heroImageUrl: string | null;
  features: string[];
  compatibility: string[];
  seller: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  category: Category;
  createdAt: string;
  detailImages: ProductImages[];
  tags: Tag[];
}
