import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
    code: string;
    errno: number;
}

@Catch()
export class DeleteUserFilter<T extends ErrorResponse>
    implements ExceptionFilter
{
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp(); // 获取 http 上下文
        const response = ctx.getResponse<Response>(); // 获取 response 对象

        if (exception.code === 'ER_ROW_IS_REFERENCED_2') {
            // 由于外键约束引起的错误
            response.status(400).json({
                message: '该用户已经被其他数据引用，无法删除！',
                errno: exception.errno,
            });
        } else {
            // 处理其他类型的异常, 默认情况下直接返回一个 500 错误响应
            response
                .status(500)
                .json({ message: '服务器出错了，请稍后再试。' });
        }
    }
}
