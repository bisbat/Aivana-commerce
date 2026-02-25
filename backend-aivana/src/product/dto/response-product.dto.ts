import { Expose, Type } from 'class-transformer';
import { ResponseProductImageDto } from 'src/product-image/dto/response-product-image.dto';
import { ResponseCategoryDto } from 'src/category/dto/response-category.dto';
import { ResponseTagDto } from 'src/tag/dto/response-tag.dto';
import { MinimalSellerDto } from 'src/seller/dto/minimal-seller.dto';
import { ReviewDto } from 'src/review/dto/review.dto';

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
  @Type(() => MinimalSellerDto)
  seller: MinimalSellerDto;
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
  @Expose()
  isDeleted: boolean;
  @Expose()
  isHidden: boolean;
  @Expose()
  deletedAt?: Date;
  @Expose()
  hiddenAt?: Date;
  @Expose()
  deletionReason?: string;
  @Expose()
  hasReviewed: boolean;

  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];
  @Expose()
  averageRating: number;
  @Expose()
  totalReviews: number;
}
