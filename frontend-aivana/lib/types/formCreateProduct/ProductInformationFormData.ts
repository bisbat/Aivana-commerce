export interface ProductInformationFormData {
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