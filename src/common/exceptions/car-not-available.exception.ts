import { BadRequestException } from '@nestjs/common';

export class CarNotAvailableException extends BadRequestException {
    constructor(carId: number, startDate: Date, endDate: Date) {
        super(`Car with ID ${carId} is not available from ${startDate} to ${endDate}!`);
    }
}