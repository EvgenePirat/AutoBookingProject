import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';
import { CarDto } from 'src/cars/dto/response/car-dto';

export class OrderDto {
  
  @ApiProperty({
    description: 'Unique identifier of the order',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the car associated with the order',
    example: 5,
  })
  carId: number;

  @ApiProperty({
    description: 'Start date of the order (rental period)',
    example: '2025-02-10T10:00:00Z',
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the order (rental period)',
    example: '2025-02-10T14:00:00Z',
  })
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Total price for the order, calculated based on rental time and hourly rate',
    example: 200.50,
  })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Quantity of cars rented in this order (default is 1)',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Details of the car associated with the order',
    type: () => CarDto,
  })
  car?: CarDto | null;
}