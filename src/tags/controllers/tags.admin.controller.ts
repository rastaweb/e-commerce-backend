import { BadRequestException, Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuardIsAdmin } from 'src/auth/guards/auth.isAdmin.guard';
import { CreateTagDto } from '../dto/create.tag.dto';
import { TagsAdminService } from '../services/tags.admin.service';

@Controller('/api/admin/tags')
export class TagsAdminController {
    constructor(private readonly tagsAdminService: TagsAdminService) { }

    @UseGuards(AuthGuardIsAdmin)
    @Post()
    create(
        @Body() createTagDto: CreateTagDto
    ) {
        return this.tagsAdminService.create(createTagDto)
    }


    @UseGuards(AuthGuardIsAdmin)
    @Delete('/many/:tagIds')
    deleteMany(
        @Param('tagIds') tagIds: string
    ) {
        if (tagIds.includes(' ')) throw new BadRequestException('آیدی برچسب‌ها باید با کاما از هم جدا شوند!');
        return this.tagsAdminService.removeTagsWithRelations(tagIds)
    }

}