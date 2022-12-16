import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ErrorCode } from '../constants/error-code';
import { ErrorMessage } from '../constants/error-message';

export class ExceptionFactory {
  static create(
    key: ErrorCode,
    info?: any,
  ): BadRequestException | ForbiddenException | UnauthorizedException {
    switch (key) {
      case ErrorCode.EMAIL_ALREADY_USED:
        return new BadRequestException({
          message: ErrorMessage.AUTH.EMAIL_ALREADY_USED,
          code: ErrorCode.EMAIL_ALREADY_USED,
        });
      case ErrorCode.EMAIL_ALREADY_USED:
        return new NotFoundException({
          message: ErrorMessage.AUTH.EMAIL_ALREADY_USED,
          code: ErrorCode.EMAIL_ALREADY_USED,
        });
      case ErrorCode.EMAIL_ALREADY_USED:
        return new BadRequestException({
          message: ErrorMessage.AUTH.PASSWORD_NOT_CORRECT,
          code: ErrorCode.PASSWORD_NOT_CORRECT,
        });
      case ErrorCode.INVALID_SIGNATURE:
        return new BadRequestException({
          message: ErrorMessage.AUTH.INVALID_SIGNATURE,
          code: ErrorCode.INVALID_SIGNATURE,
        });
    }
  }
}
