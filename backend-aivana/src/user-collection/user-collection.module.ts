import { Module } from '@nestjs/common';
import { UserCollectionService } from './user-collection.service';
import { UserCollectionController } from './user-collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCollectionEntity } from './entities/user-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCollectionEntity])],
  controllers: [UserCollectionController],
  providers: [UserCollectionService],
  exports: [UserCollectionService],
})
export class UserCollectionModule {}
