export interface ProductCreatePayload {
  // Step 1
  productType: string;
  file: File | null;
  keywords: string;

  // Step 2
  name: string;
  uploaded_file_path: string;
  description: string;
  price: number;
  blurb: string;
  installation_guide: string;
  preview_url: string | null;
  hero_image_url: string | null;
  features: string[];

  // Step 3
  heroImage: File | null;
  detailImages: File[];
}
