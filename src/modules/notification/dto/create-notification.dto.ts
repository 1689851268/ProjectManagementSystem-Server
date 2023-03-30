export class CreateNotificationDto {
    title: string;
    content: string;
    publishTime?: string;
    lastUpdateTime?: string;
    publisher?: number;
    lastUpdater?: number;
    attachment?: {
        name: string;
        url: string;
    }[];
}
