import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @IsString({ message: 'نام فارسی برند باید از نوع رشته باشد!' })
    @IsNotEmpty({ message: 'نام فارسی برند الزامیست!' })
    fa_name: string

    @IsString({ message: 'نام انگلیسی برند باید از نوع رشته باشد!' })
    @IsNotEmpty({ message: 'نام انگلیسی برند الزامیست!' })
    en_name: string
}