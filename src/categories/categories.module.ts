import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesAdminController } from './controllers/categories.admin.controller';
import { CategoriesAdminService } from './services/categories.admin.service';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/services/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),
  ],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService, CategoriesAdminService, ProductsService],
  exports: [CategoriesAdminService]
})
export class CategoriesModule { }
