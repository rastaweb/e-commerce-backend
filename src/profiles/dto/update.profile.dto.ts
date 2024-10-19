import { IsNotEmpty} from "class-validator"

export class UpdateProfileDto {
    // @IsString({ message: "مقدار نام باید استرینگ باشد!" })
    @IsNotEmpty({ message: 'فیلد نام اجباری است!' })
    name: string

    // @IsString({ message: "مقدار نام خانوادگی باید استرینگ باشد!" })
    @IsNotEmpty({ message: 'فیلد نام خانوادگی اجباری است!' })
    family: string

    // @IsString({ message: "مقدار کدملی باید استرینگ باشد!" })
    @IsNotEmpty({ message: 'فیلد کدملی اجباری است!' })
    national_code: string
}