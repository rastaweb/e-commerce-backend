import { BadRequestException, Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
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

  @UseGuards(AuthGuardIsAdmin)
  @Delete('/slug/:slug/tags/:tags')
  removeTags(
    @Param('slug') slug: string,
    @Param('tags') tags: string,
  ) {
    if (tags.includes(' ')) throw new BadRequestException('آیدی برچسب‌ها باید با کاما از هم جدا شوند!');
    return this.productsAdminService.removeProductTags(slug, tags)
  }

  @UseGuards(AuthGuardIsAdmin)
  @Post('slug/:slug/tags/:tags')
  addTags(
    @Param('slug') slug: string,
    @Param('tags') tags: string,
  ) {
    if (tags.includes(' ')) throw new BadRequestException('آیدی برچسب‌ها باید با کاما از هم جدا شوند!');
    return this.productsAdminService.addTags(slug, tags)
  }


}
