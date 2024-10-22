import { Controller } from '@nestjs/common';
import { TagsService } from '../services/tags.service';

@Controller('tags.admin')
export class TagsAdminController {
    constructor(private readonly tagsService: TagsService) {}
}
