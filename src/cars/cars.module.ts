import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';  
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car } from './entities/Car';  

@Module({
  imports: [SequelizeModule.forFeature([Car])], 
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}