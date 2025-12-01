import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { ResponseProductDto } from 'src/products/dto/response-product.dto';

export class ResponseSellerDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @Expose()
  storeName: string;

  @Expose()
  bio?: string;

  @Expose()
  location?: string;

  @Expose()
  @Type(() => ResponseProductDto)
  products: ResponseProductDto[];

  @Expose()
  totalProducts: number;

  @Expose()
  totalSales: number;

  @Expose()
  averageRating: number;

  @Expose()
  totalReviews: number;

  @Expose()
  skills?: string[];

  @Expose()
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    github?: string;
    linkedin?: string;
  };

  @Expose()
  bankInfo?: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
