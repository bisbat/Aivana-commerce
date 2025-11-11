export interface Category {
  id: string;
  name: string;
  description: string;
}

// Seller type - matches what backend sends
export interface Seller {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  promptpay_id: string;
  role: string;
  // Note: password should NOT be sent from backend!
}

// Product type - EXACTLY matching your Postman response
export interface Product {
  id: string;                    // ← Changed from number to string
  file_path: string;
  title: string;
  description: string;
  installation_doc: string;
  blurb: string;
  preview_url: string;
  price: string;                 // ← Changed from number to string
  features: string[];
  category: Category;            // ← Nested object
  seller: Seller;                // ← Nested object
  created_at: string;
  updated_at: string;
  hero_image: string;
}

export interface ProductDataStep1 {
  productType: string;
  file: File | null;
  keywords: string;
}

export interface ProductDataStep2 {
  // ...
  productName: string;
  blurb?: string;
  category: string;
  description?: string;
  features: string[];
  installationDoc?: string;
  tags?: string[];
  price: string;
  howToUse?: string;
  livePreview?: string;
}

export interface ProductDataStep3 {
  heroImage: File | null;
  detailImages: File[];
}

export interface ProductDataForm extends ProductDataStep1, ProductDataStep2, ProductDataStep3 { }

export interface ProductData {
  // Step 1
  productType: string;
  file: File | null;
  keywords: string;
  // Step 2
  productName: string;
  blurb?: string;
  category: string;
  description?: string;
  features: string[];
  installationDoc?: string;
  tags?: string[];
  price: string;
  howToUse?: string;
  livePreview?: string;

  // Step 3
  heroImage: File | null;
  detailImages: File[];
}

// NEW: Data from Step 1 (Upload File Form)
export interface UploadFileData {
  productType: 'UI Kit' | 'Coded Template';
  file: File | null;
  keywords: string;
}

export interface UploadImageData {
  heroImage: File | null;
  detailImages: File[];
}