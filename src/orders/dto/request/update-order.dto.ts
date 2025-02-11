import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsStartDateBeforeEndDate } from 'src/common/validators/is-start-date-before-end-date.validator';

export class UpdateOrderDto {

  @ApiProperty({
    description: 'The unique identifier of the car',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be a positive number' })
  id: number;

  @ApiProperty({
    description: 'Car ID',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  carId?: number;

  @ApiProperty({
    description: 'Rental start date',
    example: '2025-02-10T00:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsStartDateBeforeEndDate('endDate')
  startDate?: Date;

  @ApiProperty({
    description: 'Rental end date',
    example: '2025-02-15T00:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @ApiProperty({
    description: 'Quantity of cars for rental',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  quantity?: number;
}