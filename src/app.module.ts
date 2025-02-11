import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarsModule } from './cars/cars.module';
import { OrdersModule } from './orders/orders.module';
import { Car } from './cars/entities/Car';
import { Order } from './orders/entities/Order';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [Car, Order],
      autoLoadModels: true,
      synchronize: true,
    }),
    CarsModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => new LoggingInterceptor(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
