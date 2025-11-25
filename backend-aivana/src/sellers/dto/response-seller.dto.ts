import { Expose, Type } from "class-transformer";
import { ResponseUserDto } from "src/users/dto/response-user.dto";
import { ResponseProductDto } from "src/products/dto/response-product.dto";

export class ResponseSellerDto {

  @Expose()
  id: string;

  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @Expose()
  bio?: string;

  @Expose()
  location?: string;

  @Expose()
  skills?: string[];

  @Expose()
  tools?: string[];

  @Expose()
  socialLinks?: Record<string, string>;

  @Expose()
  @Type(() => ResponseProductDto)
  products: ResponseProductDto[];

  @Expose()
  bankName: string;

  @Expose()
  bankAccountNumber: string;

  @Expose()
  bankAccountName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
