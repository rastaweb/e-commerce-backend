import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagsService } from '../services/tags.service';
import { stringToNumberArray } from 'src/util/converters/stringToNumberArray';
import { PaginationValidation } from 'src/util/pipes/pagination-validation.pipe';
import { CustomParseIntPipe } from 'src/util/pipes/custom-parseInt.pipe';

@Controller('/api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Get('')
  findAll(
    @Query('page', new PaginationValidation({ key: "page", isOptional: true, defaultValue: 1 })) page: number,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10, max: 50 })) limit: number,
  ) {
    return this.tagsService.findAll(page, limit)
  }
  @Get(':id')
  findOne(
    @Param('id', new CustomParseIntPipe({ key: 'id' })) id: number
  ) {
    return this.tagsService.findOne(id)
  }

  @Get('/many/:ids')
  findManyById(
    @Param('ids') ids: string
  ) {
    return this.tagsService.findManyById(stringToNumberArray(ids))
  }


}
