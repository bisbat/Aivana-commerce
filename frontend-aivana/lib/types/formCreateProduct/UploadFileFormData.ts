export interface UploadFileFormData {
    productType: 'UI Kit' | 'frontend-template' | 'backend-template';
    file: File | null;
    keywords: string;

    useAI?: boolean;
  }