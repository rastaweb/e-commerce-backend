import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create.product.dto';
import { CategoriesAdminService } from 'src/categories/services/categories.admin.service';
import { Category } from 'src/categories/entities/category.entity';
import { TagsService } from 'src/tags/services/tags.service';
import { stringToNumberArray } from 'src/util/converters/stringToNumberArray';

@Injectable()
export class ProductsAdminService {
    constructor(
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
        private readonly categoriesAdminService: CategoriesAdminService,
        private readonly tagsService: TagsService,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const { categories, ...productData } = createProductDto;
        let categoryEntities: Array<Category>
        if (categories) {
            const categoryIds = stringToNumberArray(categories);
            categoryEntities = await this.categoriesAdminService.validateCategories(categoryIds);
        }

        const existingProductByTitle = await this.productsRepository.findOne({ where: { title: createProductDto.title } });
        if (existingProductByTitle) {
            throw new ConflictException('محصول با این عنوان قبلاً ثبت شده است.');
        }

        if (createProductDto.slug) {
            const existingProductBySlug = await this.productsRepository.findOne({ where: { slug: createProductDto.slug } });
            if (existingProductBySlug) {
                throw new ConflictException('محصول با این اسلاگ قبلاً ثبت شده است.');
            }
        }

        const finalPrice = productData.discount ? productData.price - (productData.price * (productData.discount / 100)) : productData.price;
        const newProduct = this.productsRepository.create({
            ...productData,
            categories: categoryEntities,
            slug: productData.slug || productData.title.split(' ').filter(item => item).join('-'),
            meta_title: productData.meta_title || productData.title,
            meta_description: productData.meta_description || productData.description || "",
            final_price: finalPrice
        });

        if (productData.tagIds && productData.tagIds.length > 0) {
            const tags = await this.tagsService.findManyById(stringToNumberArray(productData.tagIds));
            newProduct.tags = tags;
        }

        return await this.productsRepository.save(newProduct);
    }
}
