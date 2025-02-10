import { 
    IsString, 
    IsNumber, 
    IsOptional, 
    Min, 
    Max, 
    Length, 
    IsPositive, 
    IsInt 
} from 'class-validator';

export class UpdateCarDto {
    @IsNumber()
    @IsInt({ message: 'ID must be an integer' })
    @Min(1, { message: 'ID must be a positive number' })
    id: number;

    @IsOptional()
    @IsString()
    @Length(2, 50, { message: 'Brand must be between 2 and 50 characters' })
    brand?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50, { message: 'Model must be between 1 and 50 characters' })
    model?: string;

    @IsOptional()
    @IsNumber()
    @IsInt({ message: 'Year must be an integer' })
    @Min(1900, { message: 'Year cannot be earlier than 1900' })
    @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
    year?: number;

    @IsOptional()
    @IsString()
    @Length(3, 30, { message: 'Color must be between 3 and 30 characters' })
    color?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive({ message: 'Price per hour must be a positive number' })
    pricePerHour?: number;

    @IsOptional()
    @IsNumber()
    @IsInt({ message: 'Available quantity must be an integer' })
    @Min(0, { message: 'Available quantity cannot be negative' })
    availableQuantity?: number;
}