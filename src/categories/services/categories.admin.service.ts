import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { Not, Repository } from "typeorm";
import { CreateCategoryDto } from "../dto/create.category.dto";
import { UpdateCategoryDto } from "../dto/update.category.dto";
import { uploadFile } from "src/util/handlers/uploadFile";

@Injectable()
export class CategoriesAdminService {
	constructor(
		@InjectRepository(Category)
		private readonly categoriesRepository: Repository<Category>,
	) {}

	async create(
		createCategoryDto: CreateCategoryDto,
		thumbnail?: Express.Multer.File,
		icon?: Express.Multer.File,
	) {
		const requestUploadThumbnail = uploadFile(thumbnail, false);
		const requestUploadIcon = uploadFile(icon, false);
		const findedCategory = await this.categoriesRepository.findOne({
			where: { name: createCategoryDto.name },
		});
		if (findedCategory)
			throw new ConflictException(
				`دسته بندی با نام [${createCategoryDto.name}] قبلا ثبت شده است!`,
			);
		let parentCategory: Category | null = null;
		if (createCategoryDto.parentId) {
			parentCategory = await this.categoriesRepository.findOne({
				where: { id: Number(createCategoryDto.parentId) },
			});
			if (!parentCategory) {
				throw new NotFoundException("دسته بندی والد پیدا نشد!");
			}
		}
		const mixedData: Category = {
			...createCategoryDto,
			thumbnail: requestUploadThumbnail?.fileName,
			icon: requestUploadIcon?.fileName,
			parent: parentCategory,
		};
		const newCategory = this.categoriesRepository.create(mixedData);
		await this.categoriesRepository.save(newCategory);
		if (thumbnail) {
			requestUploadThumbnail.upload();
		}
		if (icon) {
			requestUploadIcon.upload();
		}
		return await this.categoriesRepository.findOne({
			where: { id: newCategory.id },
			relations: ["parent", "children", "children.children"],
		});
	}

	async findOneById(id: number) {
		const category = await this.categoriesRepository.findOne({
			where: { id },
			relations: ["children", "children.children"],
		});
		if (!category) {
			throw new NotFoundException("دسته‌بندی مورد نظر یافت نشد.");
		}
		return category;
	}

	async update(
		id: number,
		updatecategoryDto: UpdateCategoryDto,
		thumbnail?: Express.Multer.File,
		icon?: Express.Multer.File,
	) {
		const category = await this.findOneById(id);
		const requestUploadThumbnail = uploadFile(thumbnail, false);
		const requestUploadIcon = uploadFile(icon, false);

		if (
			!updatecategoryDto.name &&
			!updatecategoryDto.description &&
			!thumbnail &&
			!icon &&
			updatecategoryDto.show_in_home == null
		)
			throw new BadRequestException("داده ای جهت ویرایش وجود ندارد.");

		// if (updatecategoryDto.name === category.name)
		// 	throw new ConflictException(
		// 		`نام دسته بندی و نام جدید جهت ویرایش یکسان است!`,
		// 	);
		if (updatecategoryDto.name) {
			const findedByName = await this.categoriesRepository.findOneBy({
				name: updatecategoryDto.name,
				id: Not(category.id),
			});
			console.log(findedByName);

			if (findedByName && findedByName.id != category.id)
				throw new ConflictException(
					`دسته بندی با نام [${updatecategoryDto.name}] قبلا ثبت شده است!`,
				);
		}

		const mixedData: UpdateCategoryDto = {
			...updatecategoryDto,
		};

		if (thumbnail) {
			mixedData["thumbnail"] = requestUploadThumbnail?.fileName;
		}

		if (icon) {
			mixedData["icon"] = requestUploadIcon?.fileName;
		}

		const updateResult = await this.categoriesRepository.update(id, mixedData);
		if (thumbnail) {
			requestUploadThumbnail.upload();
		}

		if (icon) {
			requestUploadIcon.upload();
		}
		if (updateResult.affected === 0) {
			throw new NotFoundException("خطا در اعمال ویرایش!");
		}
		return await this.findOneById(id);
	}

	async validateCategories(categoryIds: number[]): Promise<Category[]> {
		const categoryEntities =
			await this.categoriesRepository.findByIds(categoryIds);
		const foundCategoryIds = categoryEntities.map((category) => category.id);
		const notFoundIds = categoryIds.filter(
			(id) => !foundCategoryIds.includes(id),
		);
		if (notFoundIds.length > 0) {
			throw new NotFoundException(
				`دسته‌بندی‌های زیر یافت نشدند: ${notFoundIds.join(", ")}`,
			);
		}
		return categoryEntities;
	}
}
