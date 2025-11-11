import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/data-source';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MinioModule } from './minio/minio.module';
import { ProductImageModule } from './product-image/product-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env.dev',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    MinioModule,
    ProductImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
