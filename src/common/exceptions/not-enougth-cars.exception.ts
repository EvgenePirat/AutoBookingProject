import { BadRequestException } from '@nestjs/common';

export class NotEnoughCarsException extends BadRequestException {
    constructor(message: string = 'Not enough cars available') {
        super(message);
    }
}