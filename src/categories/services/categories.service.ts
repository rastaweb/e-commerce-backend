import { Injectable } from '@nestjs/common';
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

}
