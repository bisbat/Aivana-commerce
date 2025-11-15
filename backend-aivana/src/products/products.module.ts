import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { MinioModule } from '../minio/minio.module';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { ProductImageModule } from '../product-image/product-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, TagEntity]),
    MinioModule,
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
