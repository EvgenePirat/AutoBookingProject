import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate, IsNotEmpty, IsNumber, Min, Max, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsStartDateBeforeEndDate } from 'src/common/validators/is-start-date-before-end-date.validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Car ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  carId: number;

  @ApiProperty({
    description: 'Rental start date',
    example: '2025-02-10T00:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsStartDateBeforeEndDate('endDate')
  startDate: Date;

  @ApiProperty({
    description: 'Rental end date',
    example: '2025-02-15T00:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @ApiProperty({
    description: 'Quantity of cars for rental',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}