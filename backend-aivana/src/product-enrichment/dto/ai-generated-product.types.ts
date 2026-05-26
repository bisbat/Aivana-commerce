export interface AiGeneratedProduct {
  productName: string;
  blurb: string;
  description: string;
  features: string[];
  techStack: string[];
  compatibility: string[];
  requirements: string[];
  tags: string[];
  installationGuide?: string | null;
  suggestedCategoryName?: string;
  apiDocUrl?: string | null;
}
