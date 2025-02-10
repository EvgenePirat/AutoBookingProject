import { ApiProperty } from '@nestjs/swagger';

export class CarDto {
    @ApiProperty({
        description: 'The unique identifier of the car',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'The brand of the car',
        example: 'Toyota',
    })
    brand: string;

    @ApiProperty({
        description: 'The model of the car',
        example: 'Camry',
    })
    model: string;

    @ApiProperty({
        description: 'The year the car was manufactured',
        example: 2020,
    })
    year: number;

    @ApiProperty({
        description: 'The color of the car',
        example: 'Red',
    })
    color: string;

    @ApiProperty({
        description: 'The price per hour for renting the car',
        example: 25.99,
    })
    pricePerHour: number;

    @ApiProperty({
        description: 'The available quantity of the car',
        example: 10,
    })
    availableQuantity: number;
}