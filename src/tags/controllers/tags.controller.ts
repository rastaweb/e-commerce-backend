import { Controller } from '@nestjs/common';
import { TagsService } from '../services/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
}
