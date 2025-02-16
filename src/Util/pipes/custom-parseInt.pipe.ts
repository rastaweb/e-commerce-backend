import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface Config {
    message?: string,
    key?: string,
    isOptional?: boolean,
    defaultValue?: any
}


@Injectable()
export class CustomParseIntPipe implements PipeTransform<string, number> {
    constructor(
        private readonly config?: Config,
    ) { }
    transform(value: string): number {

        if (this.config.isOptional && !value) return this.config?.defaultValue

        if (!this.config.isOptional && !value) throw new BadRequestException(`!الزامیست ${this.config?.key} مقدار`)

        const val = Number(value);

        if (isNaN(val)) {
            throw new BadRequestException(
                this.config?.message ||
                    this.config?.key ?
                    `!باید یک عدد صحیح باشد ${this.config?.key} مقدار`
                    : "مقدار باید یک عدد صحیح باشد!"
            );
        }
        return val;
    }
}

