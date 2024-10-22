import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CustomParseIntPipe } from 'src/util/pipes/custom-parseInt.pipe';
import { PaginationValidation } from 'src/util/pipes/pagination-validation.pipe';

@Controller('/api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get('')
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':id')
  findOneById(
    @Param('id', new CustomParseIntPipe({ key: 'id', })) id: number,
    @Query('page', new PaginationValidation({ key: "page", isOptional: true, defaultValue: 1 })) page: number,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10, max: 50 })) limit: number,
  ) {
    return this.categoriesService.findOneById(id, page, limit)
  }

}
