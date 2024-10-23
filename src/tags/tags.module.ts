import { Module } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { TagsController } from './controllers/tags.controller';
import { TagsAdminController } from './controllers/tags.admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagsAdminService } from './services/tags.admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController, TagsAdminController],
  providers: [TagsService, TagsAdminService],
  exports: [TagsService]
})
export class TagsModule { }
