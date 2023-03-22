import { IsOnTop } from '@/utils/interfaces';

export class CreateNotificationDto {
    title: string;
    content: string;
    isOnTop: IsOnTop;
    publishTime?: string;
    lastUpdateTime?: string;
    publisher: number;
    lastUpdater?: number;
}
