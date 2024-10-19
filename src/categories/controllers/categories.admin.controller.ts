import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { AuthGuardIsAdmin } from 'src/auth/guards/auth.isAdmin.guard';
import { CategoriesAdminService } from '../services/categories.admin.service';
import { CreateCategoryDto } from '../dto/create.category.dto';
import { UpdateCategoryDto } from '../dto/update.category.dto';
import { CustomParseIntPipe } from 'src/Util/pipes/custom-parseInt.pipe';

@Controller('/api/admin/categories')
export class CategoriesAdminController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly categoriesAdminService: CategoriesAdminService
    ) { }


    @UseGuards(AuthGuardIsAdmin)
    @Post()
    create(
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categoriesAdminService.create(createCategoryDto)
    }

    @UseGuards(AuthGuardIsAdmin)
    @Patch(':id')
    update(
        @Param('id', new CustomParseIntPipe({ key: 'id', })) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return this.categoriesAdminService.update(id, updateCategoryDto)
    }


}
