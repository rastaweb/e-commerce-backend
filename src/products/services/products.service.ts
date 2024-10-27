import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { sortEnum } from 'src/util/enums/sort.enum';
import { ProductFiltersTypes, ProductQueryOptions } from 'src/util/filters/profucts/filter.types';
import { TagsService } from 'src/tags/services/tags.service';
import { stringToNumberArray } from 'src/util/converters/stringToNumberArray';

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
        const queryOptions: ProductQueryOptions = {};

        if (filters?.minPrice !== undefined) {
            queryOptions.final_price = MoreThanOrEqual(filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
            queryOptions.final_price = {
                ...queryOptions.final_price,
                ...LessThanOrEqual(filters.maxPrice)
            };
        }

        const priceFilters: any = {};
        if (filters?.minPrice !== undefined) {
            priceFilters.final_price = MoreThanOrEqual(filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
            priceFilters.final_price = LessThanOrEqual(filters.maxPrice);
        }

        if (filters?.isAvailable !== undefined) {
            queryOptions.quantity = filters.isAvailable ? MoreThanOrEqual(1) : 0;
        }

        if (filters?.hasDiscount !== undefined) {
            queryOptions.discount = filters.hasDiscount ? MoreThan(0) : 0;
        }

        if (Object.keys(priceFilters).length) {
            queryOptions.final_price = priceFilters.final_price;
        }

        const queryOptionsLength: number = Object.keys(queryOptions).length;

        const [products, total] = await this.productsRepository.findAndCount({
            where: queryOptionsLength ? queryOptions : undefined,
            skip: (page - 1) * limit,
            take: limit,
            order: { id: filters.sort ? sortEnum[filters.sort] || 'DESC' : 'DESC' },
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

    async findProductsByTags(tagIds: string) {
        const tags = stringToNumberArray(tagIds);
        return this.productsRepository
            .createQueryBuilder('product')
            .innerJoin('product.tags', 'tag')
            .where('tag.id IN (:...tags)', { tags })
            .groupBy('product.id')
            .addSelect('COUNT(DISTINCT tag.id)', 'tagCount')
            .orderBy('tagCount', 'DESC')
            .getMany();
    }

    async similarProductsByProductSlug(slug: string, page: number, limit: number) {
        const product = await this.findOneBySlug(slug, ['tags'], false)

        if (!product) {
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
