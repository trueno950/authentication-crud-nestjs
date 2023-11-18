import { HttpStatus } from '@nestjs/common';
export const parseHttpStatus = (code: any) => {
  let returnCode = HttpStatus.INTERNAL_SERVER_ERROR;
  switch (code) {
    case 400:
      return (returnCode = HttpStatus.BAD_REQUEST);
    case 401:
      return (returnCode = HttpStatus.UNAUTHORIZED);
    case 403:
      return (returnCode = HttpStatus.FORBIDDEN);
    case 404:
      return (returnCode = HttpStatus.NOT_FOUND);
    case 405:
      return (returnCode = HttpStatus.METHOD_NOT_ALLOWED);
    case 406:
      return (returnCode = HttpStatus.NOT_ACCEPTABLE);
    case 408:
      return (returnCode = HttpStatus.REQUEST_TIMEOUT);
    case 409:
      return (returnCode = HttpStatus.CONFLICT);
    case 415:
      return (returnCode = HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    case 429:
      return (returnCode = HttpStatus.TOO_MANY_REQUESTS);
    case 422:
      return (returnCode = HttpStatus.UNPROCESSABLE_ENTITY);
    case '22P02':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '23000':
      return (returnCode = HttpStatus.CONFLICT);
    case '23001':
      return (returnCode = HttpStatus.CONFLICT);
    case '23502':
      return (returnCode = HttpStatus.CONFLICT);
    case '23503':
      return (returnCode = HttpStatus.CONFLICT);
    case '23505':
      return (returnCode = HttpStatus.CONFLICT);
    case '23514':
      return (returnCode = HttpStatus.CONFLICT);
    case '23505':
      return (returnCode = HttpStatus.CONFLICT);
    case '23P01':
      return (returnCode = HttpStatus.CONFLICT);
    case '42501':
      return (returnCode = HttpStatus.FORBIDDEN);
    case '42601':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '42703':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '42P01':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '42P02':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '42701':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '42P07':
      return (returnCode = HttpStatus.BAD_REQUEST);
    case '53300':
      return (returnCode = HttpStatus.TOO_MANY_REQUESTS);
    default:
      return returnCode;
  }
};
