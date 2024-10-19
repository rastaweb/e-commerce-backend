import { IsOptional, IsString } from "class-validator"

export class CreateProfileDto {
    @IsString({ message: "مقدار نام خانوادگی باید استرینگ باشد!" })
    @IsOptional()
    name: string

    @IsString({ message: "مقدار نام خانوادگی باید استرینگ باشد!" })
    @IsOptional()
    family: string

    @IsString({ message: "مقدار کدملی باید استرینگ باشد!" })
    @IsOptional()
    national_code: string
}