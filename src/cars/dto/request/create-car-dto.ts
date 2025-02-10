import { 
    IsString, 
    IsNumber, 
    Min, 
    Max, 
    Length, 
    IsPositive, 
    IsInt 
} from 'class-validator';

export class CreateCarDto {
    @IsString()
    @Length(2, 50, { message: 'Brand must be between 2 and 50 characters' })
    brand: string;

    @IsString()
    @Length(1, 50, { message: 'Model must be between 1 and 50 characters' })
    model: string;

    @IsNumber()
    @IsInt({ message: 'Year must be an integer' })
    @Min(1900, { message: 'Year cannot be earlier than 1900' })
    @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
    year: number;

    @IsString()
    @Length(3, 30, { message: 'Color must be between 3 and 30 characters' })
    color: string;

    @IsNumber()
    @IsPositive({ message: 'Price per hour must be a positive number' })
    pricePerHour: number;

    @IsNumber()
    @IsInt({ message: 'Available quantity must be an integer' })
    @Min(0, { message: 'Available quantity cannot be negative' })
    availableQuantity: number;
}
