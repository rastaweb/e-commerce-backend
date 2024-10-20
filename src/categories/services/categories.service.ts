import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    ) { }

    async findAll() {
        return await this.categoriesRepository.find()
    }

    async findOneById(id: number) {
        const category = await this.categoriesRepository.findOne({ where: { id }, relations: { products: true } });
        if (!category) {
            throw new NotFoundException('دسته‌بندی مورد نظر یافت نشد.');
        }
        return category
    }

}
