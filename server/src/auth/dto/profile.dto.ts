import { IsString, MinLength, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(200)
    dailyGoal?: number;
}

export class ChangePasswordDto {
    @IsString()
    @MinLength(1)
    currentPassword!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(72)
    newPassword!: string;
}
