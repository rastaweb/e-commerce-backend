import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from '../dto/create.product.dto';
import { ProductsAdminService } from '../services/products.admin.service';
import { AuthGuardIsAdmin } from 'src/auth/guards/auth.isAdmin.guard';

@Controller('/api/admin/products')
export class ProductsAdminController {
  constructor(private readonly productsAdminService: ProductsAdminService) { }

  @UseGuards(AuthGuardIsAdmin)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsAdminService.create(createProductDto);
  }
}
