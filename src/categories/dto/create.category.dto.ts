import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString({ message: 'نام دسته بندی باید از نوع رشته باشد!' })
    @IsNotEmpty({ message: 'نام دسته بندی الزامیست!' })
    name: string

    @IsString({ message: 'نام دسته بندی باید از نوع رشته باشد!' })
    @IsOptional()
    description: string
}