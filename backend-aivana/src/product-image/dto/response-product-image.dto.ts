import { Expose } from "class-transformer";

export class ResponseProductImageDto {
    @Expose()
    id: string;
    @Expose()
    pathImage: string;
}