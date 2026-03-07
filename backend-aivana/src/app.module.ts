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
import { PassportJwtAuthGuard } from './auth/guards/passport-jwt.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { UserCollectionModule } from './user-collection/user-collection.module';
import { ReviewModule } from './review/review.module';
import { PayoutModule } from './payout/payout.module';
import { PayoutItemModule } from './payout-item/payout-item.module';
import { ReportModule } from './report/report.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { OmiseModule } from './omise/omise.module';
import { PaymentModule } from './payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';
import { AiModule } from './ai/ai.module';
import { ProductEnrichmentModule } from './product-enrichment/product-enrichment.module';

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
    OrderModule,
    OrderItemModule,
    UserCollectionModule,
    PayoutModule,
    PayoutItemModule,
    ReportModule,
    OmiseModule,
    PaymentModule,
    ScheduleModule.forRoot(),
    EmailModule,
    AiModule,
    ProductEnrichmentModule,
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
export class AppModule {}
