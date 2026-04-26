import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { UserCollectionService } from './user-collection.service';

@Controller('user-collections')
export class UserCollectionController {
  constructor(private userCollectionService: UserCollectionService) {}

  @Get()
  async getUserCollection(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    return this.userCollectionService.findByUserId(userId);
  }
}
