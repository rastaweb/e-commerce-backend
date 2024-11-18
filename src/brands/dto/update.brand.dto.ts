import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateBrandDto } from "./create.brand.dto";

export class UpdateBrandDto extends PartialType(CreateBrandDto) { }