import { CarDto } from "../dto/response/car-dto";
import { Car } from "../entities/Car";

export class CarMapper {
    static carToCarDto(car: Car): CarDto {
        return {
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
            color: car.color,
            pricePerHour: car.pricePerHour,
            availableQuantity: car.availableQuantity,
        };
    }

    static carToCarDtoArray(cars: Car[]): CarDto[] {
        if (!cars || cars.length === 0) {
            return [];
        }

        return cars.map(car => this.carToCarDto(car));
    }
}
