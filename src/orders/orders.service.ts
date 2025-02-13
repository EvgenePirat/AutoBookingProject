import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Order } from './entities/Order';
import { Car } from 'src/cars/entities/Car';
import { OrderMapper } from './mapper/OrderMapper';
import { OrderDto } from './dto/response/OrderDto ';
import { CreateOrderDto } from './dto/request/create-order-dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { NotEnoughCarsException } from 'src/common/exceptions/not-enougth-cars.exception';
import { CarsService } from 'src/cars/cars.service';
import { CarNotAvailableException } from 'src/common/exceptions/car-not-available.exception';
import { Transaction } from 'sequelize';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private readonly orderRepository: typeof Order,
        @InjectModel(Car) private readonly carRepository: typeof Car,
        private readonly sequelize: Sequelize,
        private readonly carsService: CarsService,
    ) { }

    private calculateTotalPrice(startDate: Date, endDate: Date, hourlyRate: number, quantityCars: number): number {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end.getTime() - start.getTime();

        const hours = Math.max(1, Math.ceil(timeDifference / (1000 * 3600)));

        const minutes = Math.floor((timeDifference % (1000 * 3600)) / 60000);
        const adjustedHours = minutes > 20 ? hours + 1 : hours;

        return adjustedHours * hourlyRate * quantityCars;
    }


    async getAllWithoutInclude(): Promise<OrderDto[]> {
        const orders = await this.orderRepository.findAll();
        return OrderMapper.orderToOrderDtoArray(orders);
    }

    async getAllWithAllInclude(): Promise<OrderDto[]> {
        const orders = await this.orderRepository.findAll({ include: [{ model: Car }] });
        return OrderMapper.orderToOrderDtoArray(orders);
    }

    async getOrderByIdWithAllInclude(id: number): Promise<OrderDto> {
        const orderWithCar = await this.orderRepository.findByPk(id, { include: [{ model: Car }] });

        if (!orderWithCar) {
            throw new NotFoundException(`Order by ID ${id} not found!`);
        }

        return OrderMapper.orderToOrderDto(orderWithCar);
    }

    async getOrderByIdWithoutInclude(id: number): Promise<OrderDto> {
        const orderWithCar = await this.orderRepository.findByPk(id);

        if (!orderWithCar) {
            throw new NotFoundException(`Order by ID ${id} not found!`);
        }

        return OrderMapper.orderToOrderDto(orderWithCar);
    }

    async createMultipleOrders(createOrdersDto: CreateOrderDto[]): Promise<OrderDto[]> {
        const transaction = await this.sequelize.transaction();

        try {

            const createdOrders = await Promise.all(createOrdersDto.map(async (createOrderDto) => {
                return await this.create(createOrderDto, transaction);
            }));

            await transaction.commit();

            return createdOrders;
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException || error instanceof NotEnoughCarsException || error instanceof CarNotAvailableException) {
                throw error;
            }

            throw new InternalServerErrorException('Error creating orders!');
        }
    }

    async create(createOrderDto: CreateOrderDto, transactionExist?: Transaction): Promise<OrderDto> {

        let transaction;

        if (transactionExist == null) {
            transaction = await this.sequelize.transaction();
        }
        else {
            transaction = transactionExist;
        }

        try {
            const car = await this.carRepository.findByPk(createOrderDto.carId, { transaction });

            if (!car) {
                throw new NotFoundException(`Car by ID ${createOrderDto.carId} not found!`);
            }

            const isAvailable = await this.carsService.isCarAvailable(
                car.id,
                new Date(createOrderDto.startDate),
                new Date(createOrderDto.endDate)
            );

            if (!isAvailable) {
                throw new CarNotAvailableException(car.id, createOrderDto.startDate, createOrderDto.endDate);
            }

            if (car.availableQuantity < createOrderDto.quantity) {
                throw new NotEnoughCarsException(`Not enough cars available for ID ${car.id}`);
            }

            car.availableQuantity -= createOrderDto.quantity;
            await car.save({ transaction });

            const totalPrice = this.calculateTotalPrice(
                createOrderDto.startDate,
                createOrderDto.endDate,
                car.pricePerHour,
                createOrderDto.quantity
            );

            const createdOrder = await this.orderRepository.create(
                {
                    ...createOrderDto,
                    totalPrice,
                } as Order,
                { transaction, returning: true }
            );

            if (!transactionExist) {
                await transaction.commit();

                const createdOrderWithCar = await this.getOrderByIdWithAllInclude(createdOrder.id);
                return createdOrderWithCar;
            }
            
            return OrderMapper.orderToOrderDto(createdOrder);

        } catch (error) {
            if (!transactionExist) {
                await transaction.rollback();
            }

            if (error instanceof NotFoundException || error instanceof NotEnoughCarsException || error instanceof CarNotAvailableException) {
                throw error;
            }

            throw new InternalServerErrorException('Error creating order!');
        }
    }

    async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
        const transaction = await this.sequelize.transaction();

        try {
            if (updateOrderDto.id && updateOrderDto.id != id) {
                throw new BadRequestException(`Parametr ID ${id} does not match update model order ID ${updateOrderDto.id}`);
            }

            const order = await this.orderRepository.findByPk(id, {
                include: [{ model: Car }],
                transaction
            });

            if (!order) {
                throw new NotFoundException(`Order with ID ${id} not found!`);
            }

            if (!order.car) {
                throw new NotFoundException(`Car by ID ${order.carId} not found!`);
            }

            const car = order.car;

            const isAvailable = await this.carsService.isCarAvailable(
                car.id,
                new Date(updateOrderDto.startDate || order.startDate),
                new Date(updateOrderDto.endDate || order.endDate),
                order.id
            );

            if (!isAvailable) {
                throw new CarNotAvailableException(car.id, updateOrderDto.startDate || order.startDate, updateOrderDto.endDate || order.endDate);
            }

            if (updateOrderDto.quantity && updateOrderDto.quantity !== order.quantity) {
                const quantityDifference = updateOrderDto.quantity - order.quantity;

                if (quantityDifference > 0 && car.availableQuantity < quantityDifference) {
                    throw new NotEnoughCarsException(`Not enough cars available for ID ${car.id}`);
                }

                car.availableQuantity -= quantityDifference;
                await car.save({ transaction });
            }

            const totalPrice = this.calculateTotalPrice(
                updateOrderDto.startDate || order.startDate,
                updateOrderDto.endDate || order.endDate,
                car.pricePerHour,
                updateOrderDto.quantity || order.quantity
            );

            Object.assign(order, updateOrderDto, { totalPrice });

            await order.save({ transaction });

            await transaction.commit();

            return OrderMapper.orderToOrderDto(order);
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof NotEnoughCarsException || error instanceof CarNotAvailableException) {
                throw error;
            }

            throw new InternalServerErrorException('Error updating order!');
        }
    }

    async delete(id: number): Promise<void> {
        const transaction = await this.sequelize.transaction();

        try {
            const order = await this.orderRepository.findByPk(id, { transaction });

            if (!order) {
                throw new NotFoundException(`Order with ID ${id} not found`);
            }

            const car = await this.carRepository.findByPk(order.carId, { transaction });

            if (!car) {
                throw new NotFoundException(`Car by ID ${order.carId} not found!`);
            }

            car.availableQuantity += order.quantity;
            await car.save({ transaction });

            await order.destroy({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException('Error deleting order!');
        }
    }
}
