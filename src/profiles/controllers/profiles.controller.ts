import { Controller } from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

}
