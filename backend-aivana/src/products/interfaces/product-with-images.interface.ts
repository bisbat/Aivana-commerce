import { ProductEntity } from '../entities/product.entity';

export interface DetailImageDto {
  imageId: number;
  pathImage: string;
  url: string;
}

export interface ProductWithImagesDto
  extends Omit<ProductEntity, 'productImages'> {
  detailImages: DetailImageDto[];
}
