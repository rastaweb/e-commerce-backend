import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface Config {
    message?: string,
    key?: string,
    isOptional?: boolean,
    defaultValue?: any,
    max?: number
}

@Injectable()
export class PaginationValidation implements PipeTransform<string, number> {
    constructor(private readonly config?: Config) { }

    transform(value: string): number {
        const { isOptional, defaultValue, key, message, max } = this.config || {};
        if (isOptional && !value) return defaultValue;
        if (!isOptional && !value) this.throwException(key, `!الزامیست ${key} مقدار`);
        const val = Number(value);
        if (isNaN(val)) this.throwException(key, message || `!باید یک عدد صحیح باشد ${key} مقدار`);
        if (val < 1) this.throwException(key, `!نباید کمتر از 1 باشد ${key} مقدار`);
        if ((key === "limit" && max) && val > max) this.throwException(key, `!نباید بیشتر از ${max} باشد ${key} مقدار`);

        return val;
    }

    private throwException(key: string, errorMessage: string) {
        throw new BadRequestException({
            [key]: { messages: [errorMessage] },
            statusCode: 400,
            error: "Bad Request",
        });
    }
}
