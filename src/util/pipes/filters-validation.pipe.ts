import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface Config {
    key?: string;
    isOptional?: boolean;
    defaultValue?: any;
}

@Injectable()
export class FiltersValidation implements PipeTransform<string | undefined, number | boolean | undefined> {
    constructor(private readonly config?: Config) { }

    transform(value: string | undefined): number | boolean | undefined {
        const { isOptional, defaultValue, key } = this.config || {};

        if (isOptional && !value) return defaultValue;
        if (!isOptional && (value === undefined || value === '')) {
            this.throwException(key, `!الزامیست ${key} مقدار`);
        }

        return this.validateValue(key, value);
    }

    private validateValue(key: string, value: string): number | boolean {
        switch (key) {
            case 'minPrice':
            case 'maxPrice':
                return this.validateNumericValue(key, value);
            case 'isAvailable':
            case 'hasDiscount':
                return this.validateBooleanValue(value);
            default:
                return undefined; // برای موارد دیگر
        }
    }

    private validateNumericValue(key: string, value: string): number {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            this.throwException(key, `!باید یک عدد صحیح باشد ${key} مقدار`);
        }
        if (numericValue < 0) {
            this.throwException(key, `!نباید کمتر از 0 باشد ${key} مقدار`);
        }
        return numericValue;
    }

    private validateBooleanValue(value: string | undefined): boolean {
        if (value === undefined) return true;
        return value === 'true';
    }

    private throwException(key: string, errorMessage: string): void {
        throw new BadRequestException({
            [key]: { messages: [errorMessage] },
            statusCode: 400,
            error: "Bad Request",
        });
    }
}
