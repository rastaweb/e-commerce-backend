import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesAdminController } from './controllers/categories.admin.controller';
import { CategoriesAdminService } from './services/categories.admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category])
  ],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService, CategoriesAdminService],
  exports: [CategoriesAdminService]
})
export class CategoriesModule { }
