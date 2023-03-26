export interface UserQuery {
    curPage: number;
    pageSize: number;
    name: string;
    identity: number;
    uuid: string;
}

export interface RemoveBody {
    uuid: string;
    identity: number;
}
