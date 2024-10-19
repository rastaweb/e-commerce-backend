import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { PaginationValidation } from 'src/Util/pipes/pagination-validation.pipe';
import { CustomParseIntPipe } from 'src/Util/pipes/custom-parseInt.pipe';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  // Get all products
  @Get('')
  findAll(
    @Query('page', new PaginationValidation({ key: "page" })) page: number = 1,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10 })) limit: number,
    @Query('availability', new CustomParseIntPipe({ defaultValue: 0, isOptional: true, key: 'availability' })) availability: number,
  ) {
    return this.productsService.findAll(page, limit, availability)
  }

}
