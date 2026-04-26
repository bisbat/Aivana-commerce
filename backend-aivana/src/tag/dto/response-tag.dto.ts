import { Expose } from 'class-transformer';
export class ResponseTagDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
}