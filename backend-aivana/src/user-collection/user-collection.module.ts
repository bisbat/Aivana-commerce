import { Module } from '@nestjs/common';
import { UserCollectionService } from './user-collection.service';
import { UserCollectionController } from './user-collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCollectionEntity } from './entities/user-collection.entity';
import { ReviewModule } from 'src/review/review.module';
import { ReportModule } from 'src/report/report.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCollectionEntity]),
    ReviewModule,
    ReportModule,
  ],
  controllers: [UserCollectionController],
  providers: [UserCollectionService],
  exports: [UserCollectionService],
})
export class UserCollectionModule {}
