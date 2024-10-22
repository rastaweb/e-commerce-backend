import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/services/products.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
        private readonly productsService: ProductsService
    ) { }

    async findAll() {
        return await this.categoriesRepository.find()
    }

    async findOneById(id: number, page: number, limit: number) {
        const category = await this.categoriesRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException('دسته‌بندی مورد نظر یافت نشد.');
        }
        const products = await this.productsService.findProductsByCategory(id, page, limit)
        return {
            category,
            products
        }
    }
}
