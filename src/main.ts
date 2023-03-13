import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 处理跨域
    app.enableCors({
        origin(origin, callback) {
            if (origin === process.env.CROSS_DOMAIN_WHITELIST) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    });

    // 全局注册异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(3000);
}
bootstrap();
