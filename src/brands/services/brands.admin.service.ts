import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { Not, Repository } from 'typeorm';
import { CreateBrandDto } from '../dto/create.brand.dto';
import { uploadFile } from 'src/util/handlers/uploadFile';
import { UpdateBrandDto } from '../dto/update.brand.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class BrandsAdminService {
    constructor(
        @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    ) { }

    async create(createBrandDto: CreateBrandDto, logo: Express.Multer.File) {
        const requestUploadLogo = uploadFile(logo, false)

        const brand = await this.brandRepository.findOneBy({ en_name: createBrandDto.en_name })
        if (brand) throw new ConflictException(` قبلا ثبت شده است! [${createBrandDto.en_name}] برند با نام`);

        const mixedData: CreateBrandDto = {
            ...createBrandDto,
        }

        if (logo) {
            mixedData['logo'] = requestUploadLogo?.fileName
        }

        const newBrand = this.brandRepository.create(mixedData)
        if (logo) {
            requestUploadLogo.upload()
        }
        return await this.brandRepository.save(newBrand)
    }

    async update(id: number, updateBrandDto: UpdateBrandDto, logo: Express.Multer.File) {
        const brand = await this.brandRepository.findOneBy({ id })
        if (!brand) throw new NotFoundException('برند مورد نظر یافت نشد!')
        const requestUploadLogo = uploadFile(logo, false)
        if (updateBrandDto.en_name) {
            const findedByEn_name = await this.brandRepository.findOne({ where: { en_name: updateBrandDto.en_name, id: Not(id) } })
            console.log(findedByEn_name);
            if (findedByEn_name) throw new ConflictException(`برند با نام [${updateBrandDto.en_name}] قبلا ثبت شده است!`);
        }

        const mixedData: UpdateBrandDto = {
            ...updateBrandDto,
        }

        if (logo) {
            mixedData['logo'] = requestUploadLogo?.fileName
        }
        if (!Object.keys(mixedData).length) return await this.brandRepository.findOneBy({ id })


        const updateResult = await this.brandRepository.update(id, mixedData)

        if (logo) {
            requestUploadLogo.upload()
        }

        if (updateResult.affected === 0) {
            throw new NotFoundException('خطا در اعمال ویرایش!');
        }

        return await this.brandRepository.findOneBy({ id })
    }

    async delete(id: number) {
        const brand = await this.brandRepository.findOne({ where: { id }, relations: ['products'] })
        if (!brand) throw new NotFoundException('برند مورد نظر یافت نشد!')
        const deleteResult = await this.brandRepository.update(id, { is_deleted: 1 })
        const editedProducts: Product[] = brand.products.map(item => ({
            ...item,
            is_lock: 1,
            quantity: 0,
        }))
        await this.productsRepository.save(editedProducts)
        return { message: "برند حذف شد و تمامی محصولات قفل شدند!" }
    }

}
