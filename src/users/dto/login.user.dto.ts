import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class LoginUserDto {
    // ? Required fields
    @IsString({ message: "مقدار موبایل باید استرینگ باشد!" })
    @Length(11, 11, { message: "شماره موبایل باید 11 کاراکتر باشد!" })
    @IsNotEmpty({ message: 'فیلد موبایل اجباری است!' })
    mobile: string

    @IsString({ message: "مقدار گذرواژه باید استرینگ باشد!" })
    @MinLength(6, { message: "فیلد گذرواژه باید بیش از 6 کاراکتر باشد!" })
    @IsNotEmpty({ message: 'فیلد گذرواژه اجباری است!' })
    password: string
}