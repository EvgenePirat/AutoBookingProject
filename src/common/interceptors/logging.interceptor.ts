import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Logger,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { tap, catchError } from 'rxjs/operators';
  import { LOG_REQUEST_METADATA_KEY } from '../decorators/log-request-response.decorator';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    constructor(private readonly reflector: Reflector) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
  
      const { method, url, body, params, query } = request;
  
      const isLoggingEnabled = this.reflector.get<boolean>(
        LOG_REQUEST_METADATA_KEY,
        context.getHandler(),
      ) || this.reflector.get<boolean>(LOG_REQUEST_METADATA_KEY, context.getClass());
  
      if (isLoggingEnabled) {
        const logMessage = `
          📥 Запрос: ${method} ${url}
          📌 Параметры: ${JSON.stringify(params)}
          🔍 Query: ${JSON.stringify(query)}
          📝 Тело: ${JSON.stringify(body)}
        `;
        this.logger.log(logMessage);
      }
  
      const startTime = Date.now();
  
      return next.handle().pipe(
        tap((data) => {
          if (isLoggingEnabled) {
            const duration = Date.now() - startTime;
  
            const responseLogMessage = `
              📤 Ответ: ${method} ${url} (${duration}мс)
              🛠️ Статус: ${response.statusCode}
              📦 Дані: ${JSON.stringify(data)}
            `;
            this.logger.log(responseLogMessage);
          }
        }),
        catchError((error) => {
          if (isLoggingEnabled) {
            const duration = Date.now() - startTime;
  
            const errorLogMessage = `
              📤 Ответ с ошибкой: ${method} ${url} (${duration}мс)
              🛠️ Статус: ${response.statusCode}
              ❌ Ошибка: ${error.message || error}
            `;
            this.logger.error(errorLogMessage); 
          }

          return throwError(error);
        }),
      );
    }
  }