import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./create.category.dto";
import { IsOptional, IsString } from "class-validator";
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsString({ message: 'نام دسته بندی باید از نوع رشته باشد!' })
    @IsOptional()
    show_in_home: number
}