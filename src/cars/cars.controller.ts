import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/request/create-car-dto';
import { UpdateCarDto } from './dto/request/update-car-dto';
import { CarDto } from './dto/response/car-dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getAllCars(): Promise<CarDto[]> {
    return this.carsService.getAll();
  }

  @Get(':id')
  async getCarById(@Param('id') id: number): Promise<CarDto> {
    return this.carsService.getCarById(id);
  }

  @Post()
  async createCar(@Body() createCarDto: CreateCarDto): Promise<CarDto> {
    return this.carsService.create(createCarDto);
  }

  @Put(':id')
  async updateCar(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto): Promise<CarDto> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  async deleteCar(@Param('id') id: number): Promise<void> {
    return this.carsService.delete(id);
  }
}
