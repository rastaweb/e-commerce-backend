import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
    constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>) { }
    async findAll() {
        return await this.brandRepository.find()
    }


    async findOneById(id: number, error: boolean = true) {
        const brand = await this.brandRepository.findOne({ where: { id } })
        if (error) {
            if (!brand) new NotFoundException('برند مورد نظر یافت نشد!')
        }
        return brand
    }

}