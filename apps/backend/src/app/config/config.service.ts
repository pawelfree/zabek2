import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {
    private envConfig: { [key: string]: string };

    constructor() {

        this.envConfig = {}
        
        Object.assign(this.envConfig, environment);

        if (process.env.MONGODB_URI) {
           this.envConfig = { MONGODB_URI: process.env.MONGODB_URI };
        } 

        if (process.env.JWT_PRIVATE_KEY) {
            this.envConfig = { JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY };
        }
        
    }

    get(key: string): string {
        const value =  this.envConfig[key];
        if (value) {
            return value
        }
        throw new HttpException ('Property ' + key + ' not found.', HttpStatus.INTERNAL_SERVER_ERROR);

    }
}