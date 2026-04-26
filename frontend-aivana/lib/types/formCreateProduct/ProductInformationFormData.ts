export interface ProductInformationFormData {
    name: string;
    description: string;
    price: number;
    blurb: string;
    installationGuide: string;
    previewUrl: string | null;
  
    // These always start as null during Step 2
    uploadedFilePath: null;
    heroImageUrl: null;
  
    // Always 1 for now — fixed values
    categoryId: number;
    sellerId: string;
    tagIds: number[]; 
  
    features: string[];
    compatibility: string[];
    techstack: string[];
    requirement: string[];
    apiDocUrl: string | null;
  }