import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '../dto/create.tag.dto';
import { TagsService } from './tags.service';
import { stringToNumberArray } from 'src/util/converters/stringToNumberArray';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class TagsAdminService {
    constructor(
        @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
        private readonly tagsService: TagsService,
    ) { }

    async create(createTagDto: CreateTagDto) {
        const { name } = createTagDto
        const tag = await this.tagsService.findOneByName(name, false)
        if (tag) throw new ConflictException("برچسب مورد نظر از قبل وجود دارد")
        const newTag = this.tagsRepository.create({ name })
        await this.tagsRepository.save(newTag)
        return newTag
    }

    async removeTagsWithRelations(tagIds: string) {
        const tags = stringToNumberArray(tagIds)
        await this.productsRepository
            .createQueryBuilder()
            .delete()
            .from('products_tags_tags') // نام جدول میانه
            .where('tagsId IN (:...tagIds)', { tagIds:tags }) // شناسه‌های تگ‌هایی که می‌خواهید حذف کنید
            .execute();

        await this.tagsRepository.
            createQueryBuilder()
            .delete()
            .from(Tag)
            .where('id IN (:...tags)', { tags })
            .execute()

        return {
            message: "برچسب ها با موفقیت حذف شدند!"
        }
    }

}
