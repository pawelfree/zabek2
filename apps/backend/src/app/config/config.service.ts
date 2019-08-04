import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        console.log(process.env.NODE_ENV)
        console.log(process.env.MONGODB_URI)
        if (process.env.MONGODB_URI) {
           this.envConfig = { MONGODB_URI: process.env.MONGODB_URI }
        } else {
            this.envConfig = { MONGODB_URI: 'mongodb://localhost/zabek' }
        }
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}