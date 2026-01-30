import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { MinioModule } from '../minio/minio.module';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { ProductImageModule } from '../product-image/product-image.module';
import { SellerEntity } from 'src/seller/entities/seller.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { ProductMapper } from './product.mapper';
import { ReviewModule } from 'src/review/review.module';
import { ReviewEntity } from '../review/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      TagEntity,
      SellerEntity,
      CategoryEntity,
      ProductImage,
      ReviewEntity,
    ]),
    ReviewModule,
    MinioModule,
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductMapper],
  exports: [ProductService, ProductMapper],
})
export class ProductModule {}
