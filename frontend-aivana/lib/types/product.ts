import { Category } from './category';
import { Owner } from './seller';
import { Tag } from './tag'

//product retrieve interface form back-end
export interface Product {
    id: string;
    name: string;
    uploaded_file_path: string;
    description: string;
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string | null;
    hero_image_url: string| null;
    features: string[];
    compatibility: string[];
    category: Category;
    created_at: string;
    owner: Owner;
    tags: Tag;
}

// Step 1: Upload File Form Data
  export interface UploadFileFormData {
    productType: 'UI Kit' | 'Coded Template';
    file: File | null;
    keywords: string;
  }
  
  // Step 2: Product Information Form Data
  export interface ProductInformationForm {
    name: string;
    description: string;
    price: number;
    blurb: string;
    installation_guide: string;
    preview_url: string | null;
  
    // These always start as null during Step 2
    uploaded_file_path: null;
    hero_image_url: null;
  
    // Always 1 for now — fixed values
    categoryId: number;
    ownerId: 1;
    tagIds: number[]; 
  
    features: string[];
    compatibility: string[];
  }
  
  
  // Step 3: Product Images Form Data
  export interface UploadHeroImageFormData {
    product_id: string;
    image: File;
  }

  export interface UploadDetailImageFormData {
    product_id: string;
    images: File[];   
  }

  export interface ProductImages {
    heroImage: File | null;
    detailImages: File[];
  }


// Complete form data (all 3 steps combined)
  export interface CompleteProductData {
    // Step 1
    productType: string;
    file: File | null;
    keywords: string;
    
    // Step 2
    name: string;
    uploaded_file_path: string;
    description: string;
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string| null;
    hero_image_url: string| null;
    features: string[];
    
    // Step 3
    heroImage: File | null;
    detailImages: File[];
  }
  