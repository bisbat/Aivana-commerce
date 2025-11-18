export interface ProductUpdatePayload {
    name: string;
    description: string;
    price: string;
    blurb: string;
    installation_guide: string;
    features: string[];
    compatibility: string[];
    category_id: string;
    preview_url: string;
    hero_image_url?: string | null;
    detail_images?: string[];
    uploaded_file_path?: string | null;
}