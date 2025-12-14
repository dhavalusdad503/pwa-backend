import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interface/api-response.interface';

type ControllerResponse<T> =
  | T
  | {
      data: T;
      message?: string;
    };

function hasDataProperty<T>(
  value: unknown,
): value is { data: T; message?: string } {
  return typeof value === 'object' && value !== null && 'data' in value;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  ControllerResponse<T>,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<T>>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        if (hasDataProperty<T>(result)) {
          return {
            success: true,
            message: result.message ?? 'Success',
            data: result.data,
          };
        }

        return {
          success: true,
          message: 'Success',
          data: result,
        };
      }),
    );
  }
}
