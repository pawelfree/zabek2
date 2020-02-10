import { SetMetadata } from '@nestjs/common';

//TODO zmienic na funkcje jak juz zadziala z nestjs
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
