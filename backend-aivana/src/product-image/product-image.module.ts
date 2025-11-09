import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { MinioModule } from '../minio/minio.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    MinioModule,
    ProductsModule,
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
