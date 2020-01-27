import { Lab } from '@zabek/data';

export class CreateUserDto {
    readonly email: string; 
    readonly password: string;
    readonly role: string;
    readonly lab: Lab;
}