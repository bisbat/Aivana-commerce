import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MinioService } from 'src/minio/minio.service';
import { ProductEntity } from 'src/products/entities/product.entity';
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
        }
      : null;

    return plainToInstance(
      ResponseProductDto,
      {
        ...product,
        id: product.id.toString(),
        seller,
        category,
        tags,
        detailImages,
      },
      { excludeExtraneousValues: true },
    );
  }

  toResponseList(products: ProductEntity[]): ResponseProductDto[] {
    return products.map((p) => this.toResponse(p));
  }
}
