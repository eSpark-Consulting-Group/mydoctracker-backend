import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface APIResponseType {
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  trace?: any;
}

export class APIException extends HttpException {
  constructor(response: APIResponseType, statusCode: HttpStatus) {
    super(response, statusCode);
  }
}

export class ErrorResponseBody {
  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error',
  })
  status: 'error';

  @ApiProperty({
    description: 'Error message',
    example: 'Something went wrong.',
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    example: {},
  })
  data: object;

  @ApiProperty({
    description: 'Trace',
    example: {
      response: {
        status: 'error',
        message: 'Details of error',
      },
      status: 500,
      message: 'Something went wrong',
      name: 'APIException',
    },
  })
  trace: object;
}

export class NotFoundResponseBody{
  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error',
  })
  status: 'error';

  @ApiProperty({
    description: 'Error message',
    example: 'User not found!',
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    example: {},
  })
  data: object;

  @ApiProperty({
    description: 'Trace',
    example: {
      response: {
        status: 'error',
        message: 'Details of error',
      },
      status: 404,
      message: 'User not found',
      name: 'NotFoundException',
    },
  })
  trace: object;
}