import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/Order';
import { Car } from 'src/cars/entities/Car';
import { CarsService } from 'src/cars/cars.service';

@Module({
  imports: [SequelizeModule.forFeature([Order, Car])],
  providers: [OrdersService, CarsService],
  controllers: [OrdersController]
})
export class OrdersModule {}
