import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsAdminController } from './controllers/products.admin.controller';
import { ProductsAdminService } from './services/products.admin.service';
import { CategoriesAdminService } from 'src/categories/services/categories.admin.service';
import { Category } from 'src/categories/entities/category.entity';
import { TagsService } from 'src/tags/services/tags.service';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Tag]),
  ],
  controllers: [ProductsController, ProductsAdminController],
  providers: [ProductsAdminService, ProductsService, CategoriesAdminService, TagsService],
  exports: [ProductsService]
})
export class ProductsModule { }
