import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        status: 'error',
        message: 'Invalid request',
        trace: this.flattenValidationErrors(errors),
      });
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private flattenValidationErrors(errors: any[]): string[] {
    return errors.reduce((acc: string[], error: any) => {
      if (error.constraints) {
        return [...acc, ...Object.values(error.constraints)];
      }
      if (error.children && error.children.length > 0) {
        const childErrors = this.flattenValidationErrors(error.children);
        return [...acc, ...childErrors];
      }
      return acc;
    }, []);
  }
}
