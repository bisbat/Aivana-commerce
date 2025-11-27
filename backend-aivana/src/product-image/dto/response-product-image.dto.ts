import { Expose } from "class-transformer";

export class ResponseProductImageDto {
    @Expose()
    imageId: string;
    @Expose()
    url: string;
}