import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    ) { }

    async findManyById(ids: Array<number>) {
        const tags = await this.tagsRepository.find({ where: { id: In(ids) } })
        if (!tags.length) throw new BadRequestException('برچسب های وارد شده یافت نشدند!')
        return tags
    }
}
