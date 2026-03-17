import { IsArray, IsString } from "class-validator";

export class CreateBundleDto {
    @IsArray()
    @IsString()
    category:string[];
    @IsArray()
    @IsString()
    techstack:string[];
    @IsArray()
    @IsString()
    tags:string[];
    @IsString()
    bundleGoal:string;
    @IsString()
    reason:string
}
