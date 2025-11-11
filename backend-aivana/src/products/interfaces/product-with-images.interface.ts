import { ProductEntity } from '../entities/product.entity';

export interface DetailImageDto {
  image_id: number;
  path_image: string;
  url: string;
}

export interface ProductWithImagesDto
  extends Omit<ProductEntity, 'product_images'> {
  detail_images: DetailImageDto[];
}
