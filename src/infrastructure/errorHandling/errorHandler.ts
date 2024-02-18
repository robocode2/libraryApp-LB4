import {ErrorWriterOptions} from '@loopback/rest';
import * as Sentry from '@sentry/node';
import {NextFunction, Request, Response} from 'express';
import {HttpError} from 'http-errors';
import {ValidationError} from 'joi';
import StrongErrorHandler from 'strong-error-handler';
import {logger} from '../logger';
import {IDetail} from './IDetail';
import {RequestType, getRequestType} from './requestType';
import {mapCodeToStatusCode} from './statusCodeMapping';


const strongErrorHandlerOptions = {
  debug: process.env.NODE_ENV === 'development',
  safeFields: ['details', 'errorCode']
};
const ERROR_SHUTDOWN_TIMEOUT = parseInt(process.env.ERROR_SHUTDOWN_TIMEOUT ?? '1000', 10);

export interface IErrorHandler {
  handle(error: Error, req: Request, res: Response, next: NextFunction): void;
  captureAsWarning(error: Error): void;
  capture(error: unknown): void;
}

export class ErrorHandler implements IErrorHandler {
  private markJoiErrorAsValidationError(err: HttpError) {
    if (err.isJoi === true) {
      err.code = 'VALIDATION_ERROR';
    }
  }

  private formatAjvErrorAsValidationError(err: HttpError) {
    if (err.code === 'VALIDATION_FAILED') {
      err.code = 'VALIDATION_ERROR';
      err.statusCode = mapCodeToStatusCode(err.code);
      const param = err.details[0].path;
      const message = err.details[0].message;
      err.message = `"${param}" ${message}`;
    }
  }

  private setStatusCode(err: HttpError) {
    if (!err.status && !err.statusCode && err.code) {
      const customStatusCode = mapCodeToStatusCode(err.code);
      if (customStatusCode) {
        err.statusCode = customStatusCode;
      }
    }

    if (!err.statusCode && err.status) {
      err.statusCode = err.status;
    }

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }

  private handleNotFound(url: string, requestType: RequestType) {
    const errorMessage = `Url not found (${requestType} request): ${url}`;
    logger.warn(errorMessage);
  }

  private async handleInternalServerError(err: Error, url: string, requestType: RequestType) {
    logger.error(`Server error on route ${url} with request type ${requestType}:`);
    logger.error(err);

    Sentry.captureException(err);
    await Sentry.close(ERROR_SHUTDOWN_TIMEOUT).finally(() => {
      process.exit(1);
    });
  }

  private writeErrorToResponse(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: Error & {[k: string]: any},
    req: Request,
    res: Response,
    options: ErrorWriterOptions
  ) {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clonedError: Error & {[k: string]: any} = new Error(err.message);
    Object.setPrototypeOf(clonedError, err);

    // pre-stringify custom error properties
    for (const prop in err) {
      clonedError[prop] = err[prop];
    }

    //let stack as is
    if (err.stack) {
      clonedError.stack = err.stack;
    }
    StrongErrorHandler.writeErrorToResponse(clonedError, req, res, options);
  }

  handle(error: Error, req: Request, res: Response, next: NextFunction) {
    const err = <HttpError>error;
    const requestType = getRequestType(req);
    const url = req.originalUrl;

    this.markJoiErrorAsValidationError(err);
    this.formatAjvErrorAsValidationError(err);

    if (!err.statusCode) {
      this.setStatusCode(err);
    }

    this.writeErrorToResponse(err, req, res, strongErrorHandlerOptions);

    if (err.statusCode === 404) {
      this.handleNotFound(url, requestType);
    }

    if (err.statusCode >= 500) {
      //eslint-disable-next-line no-void
      void this.handleInternalServerError(err, url, requestType);
    }
  }

  captureAsWarning(error: Error | ValidationError): void {
    logger.warn(error);
    Sentry.withScope(function (scope) {
      scope.setLevel('warning');

      if ((error as ValidationError).details) {
        scope.setExtra('details', (error as ValidationError).details);
      }

      Sentry.captureException(error);
    });
  }

  capture(error: unknown): void {
    logger.error(error);

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      if (!process.env.SENTRY_DSN) {
        return;
      }
    }

    Sentry.withScope(function (scope) {
      scope.setLevel('error');

      if ((error as {details: IDetail<unknown>[]}).details) {
        scope.setExtra('details', (error as {details: IDetail<unknown>[]}).details);
      }

      Sentry.captureException(error);
    });
  }
}
