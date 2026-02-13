import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MinioService } from 'src/minio/minio.service';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ResponseProductDto } from './dto/response-product.dto';

// products.mapper.ts
@Injectable()
export class ProductMapper {
  constructor() {}

  toResponse(product: ProductEntity): ResponseProductDto {
    const detailImages =
      product.productImages?.map((image) => ({
        imageId: image.imageId.toString(),
        url: image.pathImage,
      })) || [];

    const tags =
      product.tags?.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })) || [];

    const category = product.category
      ? {
          id: product.category.id,
          name: product.category.name,
        }
      : null;

    const seller = product.seller
      ? {
          id: product.seller.id.toString(),
          firstName: product.seller.user?.firstName,
          lastName: product.seller.user?.lastName,
          username: product.seller.user?.username,
          avatarUrl: product.seller.user?.avatarUrl,
        }
      : null;

    const reviews =
      product.reviews?.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          firstName: review.buyer.firstName,
          lastName: review.buyer.lastName,
          username: review.buyer.username,
          avatarUrl: review.buyer.avatarUrl,
        },
      })) || [];

    const totalReviews = product.reviews?.length || 0;
    const averageRating =
      totalReviews > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    return plainToInstance(
      ResponseProductDto,
      {
        ...product,
        id: product.id.toString(),
        seller,
        category,
        tags,
        detailImages,
        reviews, // ✅ รีวิวทั้งหมด
        averageRating: Math.round(averageRating * 10) / 10, // ✅ rating เฉลี่ย
        totalReviews, // ✅ จำนวนรีวิว
        isDeleted: product.isDeleted,
        deletedAt: product.deletedAt,
        deletionReason: product.deletionReason,
        deletedBy: product.deletedBy,
      },
      { excludeExtraneousValues: true },
    );
  }
  toResponseList(products: ProductEntity[]): ResponseProductDto[] {
    return products.map((p) => this.toResponse(p));
  }
}
