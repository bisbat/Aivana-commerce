export interface ProductUpdatePayload {
    name?: string;
    description?: string;
    price?: string;
    blurb?: string;
    installationGuide?: string;
    features?: string[];
    compatibility?: string[];
    categoryId?: string;
    tagIds?: number[];
    heroImage?: File;
    detailImages?: File[];
    previewUrl?: string;
    productFile?: File;
}