import { Module } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { TagsController } from './controllers/tags.controller';
import { TagsAdminController } from './controllers/tags.admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagsAdminService } from './services/tags.admin.service';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag,Product])],
  controllers: [TagsController, TagsAdminController],
  providers: [TagsService, TagsAdminService],
  exports: [TagsService]
})
export class TagsModule { }
