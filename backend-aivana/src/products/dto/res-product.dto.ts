import { Category } from "src/categories/entities/category.entity";
import { UserEntity } from "src/users/entities/user.entity";

export class ResProductDto {
    title: string;
    description?: string;
    installation_doc?: string;
    blurb?: string;
    preview_url?: string;
    price: number;
    features?: string[];
    category: Category;
    seller: UserEntity;
    file_path?: string;
    hero_image?: string;
}
