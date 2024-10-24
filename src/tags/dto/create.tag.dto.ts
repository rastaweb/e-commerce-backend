import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty({ message: 'مقدار نام الزامیست!' })
    @IsString({message:'مقدار نام باید از نوع رشته باشد!'})
    name: string
}