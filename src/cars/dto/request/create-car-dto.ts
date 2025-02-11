import { 
    IsString, 
    IsNumber, 
    Min, 
    Max, 
    Length, 
    IsPositive, 
    IsInt 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiProperty({
        description: 'The brand of the car',
        example: 'Toyota',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @Length(2, 50, { message: 'Brand must be between 2 and 50 characters' })
    brand: string;

    @ApiProperty({
        description: 'The model of the car',
        example: 'Camry',
        minLength: 1,
        maxLength: 50,
    })
    @IsString()
    @Length(1, 50, { message: 'Model must be between 1 and 50 characters' })
    model: string;

    @ApiProperty({
        description: 'The year the car was manufactured',
        example: 2020,
        minimum: 1900,
        maximum: new Date().getFullYear(),
    })
    @IsNumber()
    @IsInt({ message: 'Year must be an integer' })
    @Min(1900, { message: 'Year cannot be earlier than 1900' })
    @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
    year: number;

    @ApiProperty({
        description: 'The color of the car',
        example: 'Red',
        minLength: 3,
        maxLength: 30,
    })
    @IsString()
    @Length(3, 30, { message: 'Color must be between 3 and 30 characters' })
    color: string;

    @ApiProperty({
        description: 'The price per hour for renting the car',
        example: 25.99,
        minimum: 0,
    })
    @IsNumber()
    @IsPositive({ message: 'Price per hour must be a positive number' })
    pricePerHour: number;

    @ApiProperty({
        description: 'The available quantity of the car',
        example: 10,
        minimum: 0,
    })
    @IsNumber()
    @IsInt({ message: 'Available quantity must be an integer' })
    @Min(0, { message: 'Available quantity cannot be negative' })
    availableQuantity: number;
}