import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarsModule } from './cars/cars.module';
import { OrdersModule } from './orders/orders.module';
import { Car } from './cars/entities/Car';
import { Order } from './orders/entities/Order';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'), 
        username: configService.get<string>('DB_USER'), 
        password: configService.get<string>('DB_PASS'), 
        database: configService.get<string>('DB_NAME'), 
        models: [Car, Order], 
        autoLoadModels: true, 
        synchronize: true, 
      }),
      inject: [ConfigService], 
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