export interface ProductInformationFormData {
    name: string;
    description: string;
    price: number;
    blurb: string;
    installationGuide: string;
    previewUrl: string | null;
    uploadedFilePath: null;
    heroImageUrl: null;
    categoryId: number;
    sellerId: string;
    tagIds: number[]; 
    features: string[];
    compatibility: string[];
    techstack: string[];
    requirement: string[];
    apiDocUrl: string | null;
  }