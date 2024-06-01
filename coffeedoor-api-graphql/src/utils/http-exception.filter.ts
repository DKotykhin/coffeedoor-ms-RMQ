import {
  BadGatewayException,
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  protected readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: any, host: GqlArgumentsHost) {
    GqlArgumentsHost.create(host);
    const cause = exception.options?.cause || 'HttpExceptionFilter';
    this.logger.error(
      `${cause} code ${exception.status || 500} - ${exception.message}`,
    );

    let httpException: HttpException;
    switch (exception.status) {
      case 400:
        httpException = new BadRequestException(exception.response);
        break;
      case 401:
        httpException = new UnauthorizedException(exception.response);
        break;
      case 403:
        httpException = new ForbiddenException(exception.response);
        break;
      case 404:
        httpException = new NotFoundException(exception.response);
        break;
      case 406:
        httpException = new NotAcceptableException(exception.response);
        break;
      case 422:
        httpException = new UnprocessableEntityException(exception.response);
        break;
      case 500:
        httpException = new InternalServerErrorException(exception.response);
        break;
      case 501:
        httpException = new NotImplementedException(exception.response);
        break;
      case 502:
        httpException = new BadGatewayException(exception.response);
        break;
      case 503:
        httpException = new ServiceUnavailableException(exception.response);
        break;
      default:
        httpException = new HttpException(exception.message, exception.status);
        break;
    }
    return httpException;
  }
}
