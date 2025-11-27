import { Expose } from 'class-transformer';
export class ResponseCategoryDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
}