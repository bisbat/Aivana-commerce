import { Expose } from 'class-transformer';

export class MinimalSellerDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  username: string;
}
