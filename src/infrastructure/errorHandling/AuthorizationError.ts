import {CustomError} from 'ts-custom-error';
import {IDetail} from './IDetail';


export interface IErrorOptions {
  cause?: unknown;
}

export class AuthorizationError extends CustomError {
  readonly code = 'AUTHORIZATION_ERROR';
  readonly details: IDetail<unknown>[];

  public constructor(message: string, details: IDetail<unknown>[] = [], options?: IErrorOptions) {
    super(message, options);
    this.details = details;
  }

  static readonly messages = {
    UNAUTHORIZED: 'Request cannot be authorized',
    WRONG_CREDENTIALS: 'Request cannot be authorized, email or password incorrect',
    TOKEN_INVALID: 'Request cannot be authorized, authorization token malformed or expired',
    TOKEN_NOT_FOUND: 'Request cannot be authorized, Authorization token not found',
    CERTIFICATE_INVALID: 'Request cannot be authorized, client certificate invalid',
    CERTIFICATE_NOT_FOUND: 'Request cannot be authorized, client certificate not found'
  };
}
