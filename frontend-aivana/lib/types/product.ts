import { Category } from './category';
import { Owner } from './seller';
import { ProductHeroImage } from './product_hero_image';
import { ProductImages } from './product_images';

export interface Product {
    id: string;
    name: string;
    uploaded_file_path: string | null;
    description: string;
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string;
    hero_image_url: ProductHeroImage | null;
    features: string[];
    compatibility: string[];
    category: Category;
    owner: Owner;
    created_at: string;
    detail_images: ProductImages[];
}