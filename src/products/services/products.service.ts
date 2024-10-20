import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>
    ) { }

    async findAll(page: number, limit: number) {
        const [products, total] = await this.productsRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const next = Number(page) + 1
        let prev = Number(page) - 1

        if (prev > totalPages) prev = totalPages

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

    async findOneBySlug(slug: string) {
        const product = await this.productsRepository.findOne({ where: { slug }, relations: { categories: true } })
        if (!product) throw new NotFoundException(`محصول با اسلاگ ${slug} یافت نشد!`)
        return product
    }

}
