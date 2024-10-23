import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}