import { Category } from './category';
import { Owner } from './seller';
import { DetailImage } from './product_images';

export interface Product {
    id: string;
    name: string;
    description: string;
    uploaded_file_path: string; 
    hero_image_url: string;   
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string;
    features: string[];
    compatibility: string[];
    highlights?: string[]; 
    category: Category;
    owner: Owner;
    created_at: string;
    detail_images: DetailImage[]; 
}