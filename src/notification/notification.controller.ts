import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly configService: ConfigService, // 注入 ConfigService 实例
    ) {}

    @Get()
    getNotification() {
        return {
            DB: this.configService.get('DB'),
            DB_PORT: this.configService.get('DB_HOST'),
        };
    }
}
