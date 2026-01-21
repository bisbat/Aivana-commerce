import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from 'db/data-source';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { MinioModule } from './minio/minio.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CartModule } from './cart/cart.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { APP_GUARD } from '@nestjs/core';
import { PassportJwtAuthGuard } from './common/guards/passport-jwt.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { UserCollectionModule } from './user-collection/user-collection.module';
import { ReviewModule } from './review/review.module';
import { PayoutModule } from './payout/payout.module';
import { PayoutItemModule } from './payout-item/payout-item.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env.dev',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CategoryModule,
    ProductModule,
    MinioModule,
    ProductImageModule,
    CartModule,
    TagModule,
    SellerModule,
    AuthModule,
    UserModule,
    DashboardModule,
    ReviewModule,
    OrdersModule,
    OrderItemModule,
    UserCollectionModule,
    PayoutModule,
    PayoutItemModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PassportJwtAuthGuard,
    },
  ],
})
export class AppModule {}
