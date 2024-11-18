import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { BrandInterseptor } from '../interceptors/brands.interceptor';

@Controller('/api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }


  @Get()
  findAll() {
    return this.brandsService.findAll()
  }



}
