import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { PaginationValidation } from 'src/util/pipes/pagination-validation.pipe';
import { CustomParseIntPipe } from 'src/util/pipes/custom-parseInt.pipe';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  // Get all products
  @Get('')
  findAll(
    @Query('page', new PaginationValidation({ key: "page" })) page: number = 1,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10 })) limit: number,
  ) {
    return this.productsService.findAll(page, limit)
  }

  @Get('/id/:id')
  findOneById(
    @Param('id', new CustomParseIntPipe({ key: 'id' })) id: number
  ) {
    return this.productsService.findOneById(id)
  }

  @Get('/slug/:slug')
  findOneBySlug(
    @Param('slug') slug: string
  ) {
    return this.productsService.findOneBySlug(slug)
  }

}
