export class CreateUserDto {
    password: string;
    name: string;
    registrationTime: string;
    email: string;
    phone: string;
    identity: number;
    college?: number;
    major?: number;
    class?: number | string;
}
