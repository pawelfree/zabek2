import { Lab } from '../../lab/lab.interface';

export class CreateUserDto {
    readonly email: string; 
    readonly password: string;
    readonly role: string;
    readonly lab: Lab;
}