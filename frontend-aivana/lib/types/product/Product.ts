import { Category } from '../category';
import { Owner } from '../seller';
import { Tag } from '../tag';
import { ProductImages } from './product_images';

//product retrieve interface form back-end
export interface Product {
    id: string;
    name: string;
    uploaded_file_path: string;
    description: string;
    price: string; 
    blurb: string;
    installation_guide: string;
    preview_url: string | null;
    hero_image_url: string| null;
    features: string[];
    compatibility: string[];
    category: Category;
    created_at: string;
    detail_images: ProductImages[];
    owner: Owner;
    tags: Tag;
}
  
  
  


  
