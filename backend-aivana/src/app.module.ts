import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { Product } from './products/entities/product.entity';
import { Category } from './categories/entities/category.entity';
import { UserEntity } from './users/entities/user.entity';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env.dev',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ProductsModule, 
    CategoriesModule, 
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
