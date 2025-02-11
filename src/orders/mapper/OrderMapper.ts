import { CarMapper } from "src/cars/mapper/CarMapper";
import { Order } from "../entities/Order";
import { OrderDto } from "../dto/response/OrderDto ";


export class OrderMapper {
    
    static orderToOrderDto(order: Order): OrderDto {
        return {
            id: order.id,
            carId: order.carId,
            startDate: order.startDate,
            endDate: order.endDate,
            totalPrice: order.totalPrice,
            quantity: order.quantity,
            car: order.car ? CarMapper.carToCarDto(order.car) : null,  
        };
    }

    static orderToOrderDtoArray(orders: Order[]): OrderDto[] {
        if (!orders || orders.length === 0) {
            return [];
        }

        return orders.map(order => this.orderToOrderDto(order));
    }
}
