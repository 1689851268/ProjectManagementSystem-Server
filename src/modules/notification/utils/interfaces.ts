export interface NotificationQuery {
    title: string;
    curPage: number;
    pageSize: number;
}

export interface NotificationListQuery extends NotificationQuery {
    publisher: string;
    lastUpdater: string;
}
