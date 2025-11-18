export interface UploadFileFormData {
    productType: 'UI Kit' | 'Coded Template';
    file: File | null;
    keywords: string;
  }