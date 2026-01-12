import { IsString, IsOptional, IsArray, MinLength, MaxLength } from 'class-validator';

export class CreateDeckDto {
    @IsString()
    @MinLength(1)
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    language?: string;

    // TODO: add max length validation
    @IsOptional()
    @IsArray()
    tags?: string[];
}

export class UpdateDeckDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsArray()
    tags?: string[];
}
