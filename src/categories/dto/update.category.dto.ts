import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./create.category.dto";
import { IsNumber, IsOptional, Max, Min, } from "class-validator";
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsNumber()
    @Min(0)
    @Max(1)
    @IsOptional()
    show_in_home: number
}