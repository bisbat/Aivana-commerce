import { Expose, Type } from 'class-transformer';
import { ResponseProductImageDto } from 'src/product-image/dto/response-product-image.dto';

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
  categoryId: number;
  @Expose()
  sellerId: string;
  @Expose()
  tags: Array<string>;
  @Expose()
  @Type(() => ResponseProductImageDto)
  detailImages: Array<ResponseProductImageDto>;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}