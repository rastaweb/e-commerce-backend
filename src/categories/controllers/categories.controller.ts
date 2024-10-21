import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CustomParseIntPipe } from 'src/util/pipes/custom-parseInt.pipe';

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
  ) {
    return this.categoriesService.findOneById(id)
  }

}
