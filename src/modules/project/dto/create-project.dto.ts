export class CreateProjectDto {
    name: string;
    publishTime?: string;
    applicationDate?: string;
    projectLeader?: number;
    type: number;
    teacher: number;
    specialist?: number;
    status?: number;
    students?: number[];
    description: string;
}
