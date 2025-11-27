import { Expose, Type } from 'class-transformer';
import { ResponseProductImageDto } from 'src/product-image/dto/response-product-image.dto';
import { ResponseCategoryDto } from 'src/categories/dto/response-category.dto';
import { ResponseTagDto } from 'src/tags/dto/response-tag.dto';

export class ResponseProductDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  uploadedFilePath?: string;
  @Expose()
  description: string;
  @Expose()
  price: number;
  @Expose()
  blurb?: string;
  @Expose()
  installationGuide: string;
  @Expose()
  previewUrl?: string;
  @Expose()
  heroImageUrl?: string;
  @Expose()
  features: Array<string>;
  @Expose()
  compatibility: Array<string>;
  @Expose()
  sellerId: string;
  @Expose()
  @Type(() => ResponseCategoryDto)
  category: ResponseCategoryDto;
  @Expose()
  @Type(() => ResponseTagDto)
  tags: Array<ResponseTagDto>;
  @Expose()
  @Type(() => ResponseProductImageDto)
  detailImages: Array<ResponseProductImageDto>;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}