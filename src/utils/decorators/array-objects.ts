import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

@ValidatorConstraint()
export class IsArrayOfObjectsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }

    return value.every(
      (item) => typeof item === 'object' && !Array.isArray(item),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `Each element in the ${args.property} array must be an object`;
  }
}

export function IsArrayOfObjects(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsArrayOfObjectsConstraint,
    });
  };
}