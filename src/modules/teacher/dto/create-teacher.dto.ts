export class CreateTeacherDto {
    password: string;
    name: string;
    email?: string;
    phone?: string;
    college: number;
    identity?: number;
    registrationTime?: string;
}
