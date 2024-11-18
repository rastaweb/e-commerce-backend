import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString({ message: 'نام دسته بندی باید از نوع رشته باشد!' })
    @IsNotEmpty({ message: 'نام دسته بندی الزامیست!' })
    name: string

    @IsString({ message: 'نام دسته بندی باید از نوع رشته باشد!' })
    @IsOptional()
    description: string

    @IsNumberString({ no_symbols: true, locale: 'en-AU' }, { message: 'آیدی دسته بندی والد باید از نوع عدد باشد!' })
    @IsOptional()
    parentId: string
}