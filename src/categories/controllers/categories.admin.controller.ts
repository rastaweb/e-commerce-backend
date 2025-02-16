import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { AuthGuardIsAdmin } from "src/auth/guards/auth.isAdmin.guard";
import { CategoriesAdminService } from "../services/categories.admin.service";
import { CreateCategoryDto } from "../dto/create.category.dto";
import { UpdateCategoryDto } from "../dto/update.category.dto";
import { CustomParseIntPipe } from "src/util/pipes/custom-parseInt.pipe";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { ImageValidationPipe } from "src/util/pipes/Image-file-validation.pipe";

const fileFilter = (req, file, cb) => {
	const allowedMimeTypes = ["image/jpeg", "image/png"];
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new BadRequestException(`فرمت های مجاز `), false);
	}
};

@Controller("/api/admin/categories")
export class CategoriesAdminController {
	constructor(
		private readonly categoriesService: CategoriesService,
		private readonly categoriesAdminService: CategoriesAdminService,
	) {}

	@UseGuards(AuthGuardIsAdmin)
	@Post()
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: memoryStorage(),
			fileFilter,
		}),
	)
	create(
		@Body() createCategoryDto: CreateCategoryDto,
		@UploadedFiles(ImageValidationPipe) files: Array<Express.Multer.File>,
	) {
		let thumbnail: Express.Multer.File;
		let icon: Express.Multer.File;
		if (files) {
			thumbnail = files.find((file) => file.fieldname === "thumbnail");
			icon = files.find((file) => file.fieldname === "icon");
		}
		console.log(files);

		return this.categoriesAdminService.create(
			createCategoryDto,
			thumbnail,
			icon,
		);
	}

	@UseGuards(AuthGuardIsAdmin)
	@Patch(":id")
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: memoryStorage(),
			fileFilter,
		}),
	)
	update(
		@Param("id", new CustomParseIntPipe({ key: "id" })) id: number,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@UploadedFiles(ImageValidationPipe) files: Array<Express.Multer.File>,
	) {
		let thumbnail: Express.Multer.File;
		let icon: Express.Multer.File;
		if (files) {
			thumbnail = files.find((file) => file.fieldname === "thumbnail");
			icon = files.find((file) => file.fieldname === "icon");
		}

		return this.categoriesAdminService.update(
			id,
			updateCategoryDto,
			thumbnail,
			icon,
		);
	}
}
