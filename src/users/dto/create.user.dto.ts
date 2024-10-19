import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {

    // ! Protected fields

    
    // ? Required fields

    @IsString({ message: "مقدار موبایل باید استرینگ باشد!" })
    @Length(11, 11, { message: "شماره موبایل باید 11 کاراکتر باشد!" })
    @IsNotEmpty({ message: 'فیلد موبایل اجباری است!' })
    mobile: string

    @IsString({ message: "مقدار گذرواژه باید استرینگ باشد!" })
    @MinLength(6, { message: "فیلد گذرواژه باید بیش از 6 کاراکتر باشد!" })
    @IsNotEmpty({ message: 'فیلد گذرواژه اجباری است!' })
    password: string


    // ? Optional fields
    @IsString({ message: "نام کاربری باید استرینگ باشد" })
    @MinLength(4, { message: "فیلد نام کاربری باید بیش از 4 کاراکتر باشد!" })
    @IsOptional()
    username?: string

    @IsEmail()
    @IsOptional()
    email?: string
}