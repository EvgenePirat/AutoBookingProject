import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Car } from './entities/Car';
import { CreateCarDto } from './dto/request/create-car-dto';
import { UpdateCarDto } from './dto/request/update-car-dto';
import { CarDto } from './dto/response/car-dto';
import { CarMapper } from './mapper/CarMapper';
import { Order } from 'src/orders/entities/Order';

@Injectable()
export class CarsService {
    constructor(
        @InjectModel(Car) private readonly carRepository: typeof Car,
        private readonly sequelize: Sequelize,
    ) { }

    async getAllWithoutInclude(): Promise<CarDto[]> {
        const cars = await this.carRepository.findAll();
        return CarMapper.carToCarDtoArray(cars);
    }

    async getAllWithAllInclude(): Promise<CarDto[]> {
        const cars = await this.carRepository.findAll({ include: [{ model: Order }] });
        return CarMapper.carToCarDtoArray(cars);
    }

    async getCarByIdWithoutInclude(id: number): Promise<CarDto> {
        const car = await this.carRepository.findByPk(id);

        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found!`);
        }

        return CarMapper.carToCarDto(car);
    }

    async getCarByIdWithAllInclude(id: number): Promise<CarDto> {
        const car = await this.carRepository.findByPk(id, {
            include: [{ model: Order }],
        });

        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found!`);
        }

        return CarMapper.carToCarDto(car);
    }

    async isCarAvailable(carId: number, startDate: Date, endDate: Date, excludeOrderId?: number): Promise<boolean> {
        const car = await this.carRepository.findByPk(carId, {
            include: [{ model: Order }]
        });

        if (!car) {
            throw new NotFoundException(`Car with ID ${carId} not found!`);
        }

        const hasOverlappingOrders = car.orders.some(order =>
            order.id !== excludeOrderId &&
            (order.startDate <= endDate && order.endDate >= startDate)
        );

        return !hasOverlappingOrders;
    }

    async create(createCarDto: CreateCarDto): Promise<CarDto> {
        const transaction = await this.sequelize.transaction();

        try {
            const createdCar = await this.carRepository.create({ ...createCarDto } as Car, { transaction });

            await transaction.commit();
            return CarMapper.carToCarDto(createdCar);
        } catch (error) {
            await transaction.rollback();

            throw new InternalServerErrorException('Error creating car!');
        }
    }

    async update(id: number, updateCarDto: UpdateCarDto): Promise<CarDto> {
        const transaction = await this.sequelize.transaction();

        try {

            if (updateCarDto.id && updateCarDto.id != id) {
                throw new BadRequestException(`Parametr ID ${id} does not match update model car ID ${updateCarDto.id}`);
            }

            const car = await this.carRepository.findByPk(id, { transaction });

            if (!car) {
                throw new NotFoundException(`Car with ID ${id} not found`);
            }

            car.set(updateCarDto);

            await car.save({ transaction });

            await transaction.commit();
            return CarMapper.carToCarDto(car);
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Error updating car!');
        }
    }


    async delete(id: number): Promise<void> {
        const transaction = await this.sequelize.transaction();
        try {
            const deletedCount = await this.carRepository.destroy({
                where: { id },
                transaction,
            });

            if (deletedCount === 0) {
                throw new NotFoundException(`Car with ID ${id} not found`);
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException('Error deleting car!');
        }
    }
}