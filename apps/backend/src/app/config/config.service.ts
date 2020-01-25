import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {
    private envConfig: { [key: string]: string };

    constructor() {

        this.envConfig = {}
        
        Object.assign(this.envConfig, environment);

        if (process.env.MONGODB_URI) {
           Object.assign(this.envConfig,{ MONGODB_URI: process.env.MONGODB_URI });
        } 

        if (process.env.JWT_PRIVATE_KEY) {
            Object.assign(this.envConfig, { JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY });
        }

        if (process.env.LOGIN_EXPIRES_IN) {
            Object.assign(this.envConfig, {LOGIN_EXPIRES_IN: process.env.LOGIN_EXPIRES_IN});
        }

        if (process.env.ZABEK_SENDGRID_API_KEY) {
            Object.assign(this.envConfig, { ZABEK_SENDGRID_API_KEY: process.env.ZABEK_SENDGRID_API_KEY});
        }

        if (process.env.RESET_TOKEN_EXPIRES_IN) {
            Object.assign(this.envConfig, { RESET_TOKEN_EXPIRES_IN: process.env.RESET_TOKEN_EXPIRES_IN});
        }

        if (process.env.SECRET_API_KEY) {
            Object.assign(this.envConfig, { SECRET_API_KEY: process.env.SECRET_API_KEY});
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