import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

// 跨域配置
function getCorsOptions() {
    return {
        origin(
            origin: string,
            callback: (err: Error | null, allow?: boolean) => void,
        ) {
            if (origin === process.env.CROSS_DOMAIN_WHITELIST || 1 === 1) {
                callback(null, true); // 允许跨域
            } else {
                callback(new Error('Not allowed by CORS')); // 不允许跨域
            }
        },
    };
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 加载环境变量
    dotenv.config();

    // 处理跨域
    app.enableCors(getCorsOptions());

    // 使用全局管道
    app.useGlobalPipes(
        new ValidationPipe({
            // whitelist: true, // 开启白名单, 剥离经过验证的对象中没有任何装饰器的任何属性
        }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);
}
bootstrap();
