import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    ) { }

    async findAll(page: number, limit: number,) {
        const [products, total] = await this.tagsRepository.findAndCount({
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

    async findManyById(ids: Array<number>) {
        const tags = await this.tagsRepository.find({ where: { id: In(ids) } })
        if (!tags.length) throw new NotFoundException('برچسب های وارد شده یافت نشدند!')
        return tags
    }

    async findOne(id: number) {
        const tag = await this.tagsRepository.findOneBy({ id, products: true })
        if (!tag) throw new NotFoundException('برچسب مورد نظر یافت نشد!')
        return tag
    }
}
