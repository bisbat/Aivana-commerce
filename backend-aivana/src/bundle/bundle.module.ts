import { Module } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';
import { AiModule } from 'src/ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Module({
  imports:[AiModule, TypeOrmModule.forFeature([ProductEntity,CategoryEntity])],
  controllers: [BundleController],
  providers: [BundleService],
})
export class BundleModule {}
