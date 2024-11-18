import { Module } from '@nestjs/common';
import { BrandsService } from './services/brands.service';
import { BrandsController } from './controllers/brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandsAdminController } from './controllers/brands.admin.controller';
import { BrandsAdminService } from './services/brands.admin.service';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand,Product])],
  controllers: [BrandsController, BrandsAdminController],
  providers: [BrandsService, BrandsAdminService],
})
export class BrandsModule { }
