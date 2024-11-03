import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CustomParseIntPipe } from 'src/util/pipes/custom-parseInt.pipe';
import { FiltersValidation } from 'src/util/pipes/filters-validation.pipe';
import { PaginationValidation } from 'src/util/pipes/pagination-validation.pipe';
import { sortEnum } from 'src/util/enums/sort.enum';
import { ProductFiltersTypes } from 'src/util/filters/profucts/filter.types';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  // Get all products
  @Get('')
  findAll(
    @Query('page', new PaginationValidation({ key: "page", isOptional: true, defaultValue: 1 })) page: number,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10, max: 50 })) limit: number,
    @Query('minPrice', new FiltersValidation({ key: "minPrice", isOptional: true, defaultValue: 0 })) minPrice?: number,
    @Query('maxPrice', new FiltersValidation({ key: "maxPrice", isOptional: true })) maxPrice?: number,
    @Query('isAvailable', new FiltersValidation({ key: "isAvailable", isOptional: true })) isAvailable?: boolean,
    @Query('hasDiscount', new FiltersValidation({ key: "hasDiscount", isOptional: true })) hasDiscount?: boolean,
    @Query('sort') sort?: string,
    @Query('tags') tags?: string,
  ) {
    if (!sortEnum[sort]) {
      sort = "NEW"
    }
    if (minPrice >= maxPrice) throw new BadRequestException(`!باشد maxPrice نباید بزرگتر یا برابر minPrice مقدار`)
    const filters: ProductFiltersTypes = { minPrice, maxPrice, isAvailable, hasDiscount, sort, tags };
    return this.productsService.findAll(page, limit, filters);
  }

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

  @Get('/slug/:slug/tags')
  productTags(
    @Param('slug') slug: string
  ) {
    return this.productsService.productTags(slug)
  }


  @Get('similarProducts/slug/:slug')
  similarProductsBySlug(
    @Query('page', new PaginationValidation({ key: "page", isOptional: true, defaultValue: 1 })) page: number,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10, max: 50 })) limit: number,
    @Param('slug') slug: string,
  ) {
    return this.productsService.similarProductsByProductSlug(slug, page, limit)
  }


}
