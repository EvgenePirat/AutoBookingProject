import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/request/create-car-dto';
import { UpdateCarDto } from './dto/request/update-car-dto';
import { CarDto } from './dto/response/car-dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LogRequest } from 'src/common/decorators/log-request-response.decorator';

@ApiTags('Car')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Get("include/all")
  @ApiResponse({ status: 200, description: 'List of all cars', type: [CarDto] })
  @LogRequest()
  async getAllCarsWithAllInclude(): Promise<CarDto[]> {
    return this.carsService.getAllWithAllInclude();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all cars', type: [CarDto] })
  @LogRequest()
  async getAllCarsWithoutInclude(): Promise<CarDto[]> {
    return this.carsService.getAllWithoutInclude();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Car details retrieved successfully', type: CarDto })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @LogRequest()
  async getCarByIdWithoutInclude(@Param('id') id: number): Promise<CarDto> {
    return this.carsService.getCarByIdWithoutInclude(id);
  }

  @Get('include/:id')
  @ApiResponse({ status: 200, description: 'Car details retrieved successfully', type: CarDto })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @LogRequest()
  async getCarByIdWithAllInclude(@Param('id') id: number): Promise<CarDto> {
    return this.carsService.getCarByIdWithAllInclude(id);
  }

  @Get(':id/availability')
  @ApiResponse({ status: 200, description: 'Availability status retrieved successfully' })
  @LogRequest()
  async checkCarAvailability(
    @Param('id') id: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<boolean> {
    return this.carsService.isCarAvailable(id, new Date(startDate), new Date(endDate));
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Car successfully created', type: CarDto })
  @LogRequest()
  async createCar(@Body() createCarDto: CreateCarDto): Promise<CarDto> {
    return this.carsService.create(createCarDto);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Car successfully updated', type: CarDto })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @LogRequest()
  async updateCar(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto): Promise<CarDto> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Car successfully deleted' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @LogRequest()
  async deleteCar(@Param('id') id: number): Promise<void> {
    return this.carsService.delete(id);
  }
}