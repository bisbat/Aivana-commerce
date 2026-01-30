import { Expose, Type } from 'class-transformer';
import { ReviewUserDto } from './review-user.dto';

export class ReviewDto {
  @Expose()
  id: string;

  @Expose()
  rating: number;

  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => ReviewUserDto)
  user: ReviewUserDto;
}
