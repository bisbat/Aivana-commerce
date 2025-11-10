import { Category } from './category';
import { Owner } from './seller';
export interface Product {
    id: string;
    name: string;
    uploaded_file_path: string;
    description: string;
    
    // กำหนดให้เป็น string และแปลงเป็น number ในฟังก์ชัน fetch
    price: string; 
    
    blurb: string;
    installation_guide: string;
    preview_url: string;
    hero_image_url: string;
    
    features: string[];
    
    category: Category;
    owner: Owner;
}