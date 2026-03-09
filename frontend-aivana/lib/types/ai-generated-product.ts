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
  /** Exact category name chosen from availableCategories list */
  suggestedCategoryName?: string;
}
