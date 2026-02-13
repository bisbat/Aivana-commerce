import { Controller, Get, Req } from '@nestjs/common';
import { UserCollectionService } from './user-collection.service';

@Controller('user-collections')
export class UserCollectionController {
  constructor(private userCollectionService: UserCollectionService) {}

  @Get()
  async getUserCollection(@Req() req) {
    const userId = req.user.userId;
    return this.userCollectionService.findByUserId(userId);
  }
}
