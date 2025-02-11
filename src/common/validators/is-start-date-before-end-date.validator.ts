import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStartDateBeforeEndDate(endDateProperty: string, validationOptions?: ValidationOptions) {

  return function (object: Object, propertyName: string) {

    registerDecorator({
      name: 'isStartDateBeforeEndDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [endDateProperty],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[endDateProperty];
          return value < relatedValue; 
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be before ${args.constraints[0]}`;
        },
      },
    });
    
  };
}