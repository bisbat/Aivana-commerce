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
    ownerId: 1;
    tagIds: number[]; 
  
    features: string[];
    compatibility: string[];
  }