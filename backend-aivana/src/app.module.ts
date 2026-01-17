import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/data-source';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MinioModule } from './minio/minio.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CartModule } from './cart/cart.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { SellersModule } from './sellers/sellers.module';
import { APP_GUARD } from '@nestjs/core';
import { PassportJwtAuthGuard } from './auth/guards/passport-jwt.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env.dev',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CategoriesModule,
    ProductsModule,
    MinioModule,
    ProductImageModule,
    CartModule,
    TagsModule,
    SellersModule,
    AuthModule,
    UsersModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PassportJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
