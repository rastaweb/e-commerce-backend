import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { sortEnum } from 'src/util/enums/sort.enum';
import { ProductFiltersTypes } from 'src/util/filters/profucts/filter.types';
import { TagsService } from 'src/tags/services/tags.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
        private readonly tagsService: TagsService,
    ) { }

    async findAll(
        page: number,
        limit: number,
        filters?: ProductFiltersTypes
    ) {
        const queryBuilder = this.productsRepository.createQueryBuilder('product');

        if (filters?.minPrice) {
            queryBuilder.andWhere('product.final_price >= :minPrice', { minPrice: filters.minPrice });
        }
        if (filters?.maxPrice) {
            queryBuilder.andWhere('product.final_price <= :maxPrice', { maxPrice: filters.maxPrice });
        }

        if (filters?.isAvailable === true) {
            queryBuilder.andWhere('product.quantity >= :quantity', { quantity: 1 });
        }
        if (filters?.isAvailable === false) {
            queryBuilder.andWhere('product.quantity = :quantity', { quantity: 0 });
        }

        if (filters?.hasDiscount === true) {
            queryBuilder.andWhere('product.discount > :discount', { discount: 0 });
        }

        if (filters?.hasDiscount === false) {
            queryBuilder.andWhere('product.discount = :discount', { discount: 0 });
        }

        if (filters?.tags && filters.tags.length > 0) {
            queryBuilder
                .innerJoin('product.tags', 'tag')
                .where('tag.id IN (:...tags)', { tags: filters.tags });
        }

        const [products, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('product.id', filters.sort ? sortEnum[filters.sort] || 'DESC' : 'DESC')
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);
        const next = Number(page) + 1;
        let prev = Number(page) - 1;

        if (prev > totalPages) prev = totalPages;

        return {
            data: products,
            total,
            page,
            limit,
            totalPages,
            nextPage: page < totalPages ? `${next}` : null,
            prevPage: page > 1 ? `${prev}` : null,
        };
    }


    async findOneById(id: number) {
        const product = await this.productsRepository.findOne({ where: { id }, relations: { categories: true } })
        if (!product) throw new NotFoundException(`محصول با آیدی ${id} یافت نشد!`)
        return product
    }

    async findOneBySlug(slug: string, relations: Array<string> | null = ['categories'], error: boolean = true) {
        const product = await this.productsRepository.findOne({ where: { slug }, relations })
        if (error && !product) throw new NotFoundException(`محصول با اسلاگ ${slug} یافت نشد!`)
        return product
    }

    async findProductsByCategory(categoryId: number, page: number, limit: number) {
        const [products, total] = await this.productsRepository.findAndCount({
            where: { categories: { id: categoryId } },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const next = Number(page) + 1;
        let prev = Number(page) - 1;

        if (prev > totalPages) prev = totalPages;

        return {
            data: products,
            total,
            page,
            limit,
            totalPages,
            nextPage: page < totalPages ? `${next}` : null,
            prevPage: page > 1 ? `${prev}` : null,
        };
    }

    async productTags(slug: string) {
        const product = await this.findOneBySlug(slug, ['tags'])
        return product.tags
    }

    async similarProductsByProductSlug(slug: string, page: number, limit: number) {
        const product = await this.findOneBySlug(slug, ['tags'])
        if (!product.tags.length) {
            return {
                data: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
                nextPage: null,
                prevPage: null,
            };
        }

        const tags = product.tags.map(tag => tag.id);
        const [similarProducts, total] = await this.productsRepository
            .createQueryBuilder('product')
            .innerJoin('product.tags', 'tag')
            .where('tag.id IN (:...tags) AND product.id <> :productId', { tags, productId: product.id })
            .groupBy('product.id')
            .addSelect('COUNT(DISTINCT tag.id)', 'tagCount')
            .orderBy('tagCount', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);
        const next = Number(page) + 1;
        let prev = Number(page) - 1;

        if (prev > totalPages) prev = totalPages;


        return {
            data: similarProducts,
            total,
            page,
            limit,
            totalPages,
            nextPage: page < totalPages ? `${next}` : null,
            prevPage: page > 1 ? `${prev}` : null,
        };
    }



}
