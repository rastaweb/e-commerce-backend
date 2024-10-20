import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/create.product.dto';
import { ProductsAdminService } from '../services/products.admin.service';

@Controller('/api/admin/products')
export class ProductsAdminController {
  constructor(private readonly productsAdminService: ProductsAdminService) { }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsAdminService.create(createProductDto);
  }
}
