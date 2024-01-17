import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint()
export class IsAfterNowConstraint implements ValidatorConstraintInterface {
  validate(epochTime: number) {
    const utcSeconds = epochTime;
    const date = new Date(0);
    date.setUTCSeconds(utcSeconds);
    return Date.now() < date.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} can not before now.`;
  }
}

export function IsAfterNow(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsAfterNowConstraint,
    });
  };
}
