import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { In, Repository } from 'typeorm';
import { ProductsService } from 'src/products/services/products.service';
import { stringToNumberArray } from 'src/util/converters/stringToNumberArray';
import { Product } from 'src/products/entities/product.entity';

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


    async findManyById(ids: string, page: number, limit: number) {
        const categoryIds = stringToNumberArray(ids)

        const requests = []
        for (const id of categoryIds) {
            requests.push(this.findOneById(id, page, limit))
        }
        const categories = await Promise.all(requests)
        const mappedCategories = categories.map(({ products, category }) => {
            return {
                category,
                products: products.data,
            }
        })

        const { data, ...pagination } = categories[0].products

        return {
            data: mappedCategories,
            ...pagination
        }

    }


}
