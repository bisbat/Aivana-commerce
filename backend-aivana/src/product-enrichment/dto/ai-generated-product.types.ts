export interface AiGeneratedProduct {
  productName: string;
  blurb: string;
  description: string;
  features: string[];
  techStack: string[];
  compatibility: string[];
  requirements: string[];
  tags: string[];
  installationGuide?: string | null; // markdown, null ถ้า ui-kit
}
