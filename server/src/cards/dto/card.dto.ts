import { IsString, IsOptional, IsArray, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateCardDto {
    @IsString()
    deckId!: string;

    @IsString()
    @MinLength(1)
    question!: string;

    @IsString()
    @MinLength(1)
    answer!: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsArray()
    tags?: string[];
}

export class UpdateCardDto {
    @IsOptional()
    @IsString()
    question?: string;

    @IsOptional()
    @IsString()
    answer?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsArray()
    tags?: string[];
}

export class ReviewCardDto {
    @IsInt()
    @Min(1)
    @Max(4)
    rating!: number;
}
