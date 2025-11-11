import { Category } from './category';
import { Owner } from './seller';

export interface Product {
    id: string;
    name: string;
    uploaded_file_path: string;
    description: string;
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string| null;
    hero_image_url: string| null;
    features: string[];
    compatibility: string[];
    category: Category;
    owner: Owner;
}