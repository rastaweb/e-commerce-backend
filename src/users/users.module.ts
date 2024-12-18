import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersAdminService } from './services/users.admin.service';
import { UsersAdminController } from './controllers/users.admin.controller';

import { RolesService } from 'src/roles/services/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { ProfilesService } from 'src/profiles/services/profiles.service';
import { Profile } from 'src/profiles/entities/profile.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role,Profile])
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersAdminService, RolesService,ProfilesService],
  exports: [UsersAdminService, UsersService],
})
export class UsersModule { }
