import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // 捕获 HttpException 错误;  @Catch() 里面不写参数 则捕获所有错误
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp(); // 获取上下文
        const status = exception.getStatus(); // 获取状态码

        // 通过上下文获取请求和响应
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // 自定义响应
        response.status(status).json({
            status,
            method: request.method,
            path: request.url,
            data: exception.message || exception.name,
            time: new Date().toLocaleString(),
        });
    }
}
