import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 处理跨域
    app.enableCors({
        origin(origin, callback) {
            if (origin === process.env.CROSS_DOMAIN_WHITELIST || 1 === 1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    });

    // 全局注册异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    // 使用全局管道
    app.useGlobalPipes(
        new ValidationPipe({
            // whitelist: true, // 开启白名单, 剥离经过验证的对象中没有任何装饰器的任何属性
        }),
    );

    await app.listen(3000);
}
bootstrap();
