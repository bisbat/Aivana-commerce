import { Category } from './category';
import { Owner } from './seller';
import { ProductFile } from './product_file';
import { ProductHeroImage } from './product_hero_image';

export interface Product {
    id: string;
    name: string;
    uploaded_file_path: ProductFile;
    description: string;
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string;
    hero_image_url: ProductHeroImage;
    features: string[];
    compatibility: string[];
    highlights: string[];
    category: Category;
    owner: Owner;
    created_at: string;
}