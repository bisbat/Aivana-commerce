export interface ProductUpdatePayload {
    name?: string;
    description?: string;
    price?: string;
    blurb?: string;
    installation_guide?: string;
    features?: string[];
    compatibility?: string[];
    categoryId?: string;
    tagIds?: string[];
    heroImage?: File;
    detailImages?: File[];
    preview_url?: string;
    productFile?: File;
}