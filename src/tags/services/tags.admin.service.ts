import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '../dto/create.tag.dto';

@Injectable()
export class TagsAdminService {
    constructor(
        @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>
    ) { }

    async create(createTagDto: CreateTagDto) {
        const { name } = createTagDto
        const tag = await this.tagsRepository.findOneBy({ name })
        if (tag) throw new ConflictException("برچسب مورد نظر از قبل وجود دارد")
        const newTag = this.tagsRepository.create({ name })
        await this.tagsRepository.save(newTag)
        return newTag
    }

}
