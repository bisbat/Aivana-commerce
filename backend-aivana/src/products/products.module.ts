import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { MinioModule } from '../minio/minio.module';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { ProductImageModule } from '../product-image/product-image.module';
import { SellerEntity } from 'src/sellers/entities/seller.entity';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { ProductMapper } from './products.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      TagEntity,
      SellerEntity,
      CategoryEntity,
      ProductImage,
    ]),
    MinioModule,
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductMapper],
  exports: [ProductsService],
})
export class ProductsModule {}
