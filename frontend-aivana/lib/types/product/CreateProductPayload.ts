export interface ProductCreatePayload {
  productType: string;
  file: File | null;
  keywords: string;
  name: string;
  uploaded_file_path: string;
  description: string;
  price: number;
  blurb: string;
  installation_guide: string;
  preview_url: string | null;
  hero_image_url: string | null;
  features: string[];
  heroImage: File | null;
  detailImages: File[];
}
