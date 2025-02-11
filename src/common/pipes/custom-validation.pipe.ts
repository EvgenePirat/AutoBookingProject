import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }

        const object = plainToInstance(metadata.metatype, value);
        const errors: ValidationError[] = await validate(object);

        if (errors.length > 0) {
            const errorMessages = this.formatErrors(errors);
            throw new BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: errorMessages,
            });
        }

        return value;
    }

    private formatErrors(errors: ValidationError[]): string[] {
        return errors.map((error) => {
            const constraints = error.constraints ? Object.values(error.constraints) : [];
            return `${error.property}: ${constraints.join(', ')}`;
        });
    }

    protected toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
