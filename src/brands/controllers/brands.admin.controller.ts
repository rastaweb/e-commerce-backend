import { BadRequestException, Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuardIsAdmin } from 'src/auth/guards/auth.isAdmin.guard';
import { CreateBrandDto } from '../dto/create.brand.dto';
import { BrandsAdminService } from '../services/brands.admin.service';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/util/pipes/Image-file-validation.pipe';
import { BrandInterseptor } from '../interceptors/brands.interceptor';
import { UpdateBrandDto } from '../dto/update.brand.dto';
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`فرمت های مجاز `), false);
  }
}

@Controller('/api/admin/brands')
export class BrandsAdminController {
  constructor(private readonly brandsAdminService: BrandsAdminService) { }

  @UseGuards(AuthGuardIsAdmin)
  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
      fileFilter
    }),
  )
  create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile(ImageValidationPipe) logo: Express.Multer.File,
  ) {
    return this.brandsAdminService.create(createBrandDto, logo)
  }

  @UseGuards(AuthGuardIsAdmin)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
      fileFilter
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile(ImageValidationPipe) logo: Express.Multer.File,
  ) {
    return this.brandsAdminService.update(id, updateBrandDto, logo)
  }


  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.brandsAdminService.delete(id)
  }


}
