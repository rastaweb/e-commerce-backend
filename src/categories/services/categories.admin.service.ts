import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create.category.dto';
import { UpdateCategoryDto } from '../dto/update.category.dto';

@Injectable()
export class CategoriesAdminService {
    constructor(
        @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const findedCategory = await this.categoriesRepository.findOne({ where: { name: createCategoryDto.name } })
        if (findedCategory) throw new ConflictException(`دسته بندی با نام [${createCategoryDto.name}] قبلا ثبت شده است!`);
        const newCategory = this.categoriesRepository.create(createCategoryDto);
        await this.categoriesRepository.save(newCategory);
        return newCategory;
    }

    async findOneById(id: number) {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('دسته‌بندی مورد نظر یافت نشد.');
        }
        return category
    }

    async update(id: number, updatecategoryDto: UpdateCategoryDto) {
        const category = await this.findOneById(id)

        if (!updatecategoryDto.name && !updatecategoryDto.description) throw new BadRequestException("دیتایی جهت ویرایش وجود ندارد.")

        if (updatecategoryDto.name === category.name) throw new ConflictException(`نام دسته بندی و نام جدید جهت ویرایش یکسان است!`);

        const findedByName = await this.categoriesRepository.findOneBy({ name: updatecategoryDto.name })

        if (findedByName) throw new ConflictException(`دسته بندی با نام [${updatecategoryDto.name}] قبلا ثبت شده است!`);

        const updateResult = await this.categoriesRepository.update(id, updatecategoryDto)

        if (updateResult.affected === 0) {
            throw new NotFoundException('خطا در اعمال ویرایش!');
        }

        return await this.findOneById(id)
    }
}


