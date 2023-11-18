import { HttpException } from '@nestjs/common';
import { parseHttpStatus } from './httpStatusCode.helper';
export interface Error {
  code: number;
  description: string;
}
export interface DataResponse {
  errors?: Error[]
}
export function throwException(code: number, errorMessage: string) {
  const response = <DataResponse>{
    errors: [
      {
        code: code,
        description: errorMessage,
      },
    ],
  };
  throw new HttpException(response, parseHttpStatus(code), {});
}
