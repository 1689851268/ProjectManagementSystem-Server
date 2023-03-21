export class CreateStudentDto {
    password: string;
    name: string;
    class: number;
    major: number;
    college: number;
    email?: string;
    phone?: string;
    identity?: number;
    registrationTime?: string;
}
