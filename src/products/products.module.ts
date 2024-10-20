import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsAdminController } from './controllers/products.admin.controller';
import { ProductsAdminService } from './services/products.admin.service';
import { CategoriesAdminService } from 'src/categories/services/categories.admin.service';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category])
  ],
  controllers: [ProductsController, ProductsAdminController],
  providers: [ProductsService, ProductsAdminService, CategoriesAdminService],
})
export class ProductsModule { }
