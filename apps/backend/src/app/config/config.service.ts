import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        console.log('!!!!! config constructor');
        console.log(process.env.NODE_ENV)
       // this.envConfig = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}