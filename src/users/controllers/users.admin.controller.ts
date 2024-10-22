import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersAdminService } from '../services/users.admin.service';
import { PaginationValidation } from 'src/util/pipes/pagination-validation.pipe';
import { UserInterceptor } from '../interceptors/users.interceptor';
import { AuthGuardIsAdmin } from 'src/auth/guards/auth.isAdmin.guard';
import { Request } from 'express';
import { authPayload } from 'src/auth/auth.service';
import { UpdateProfileDto } from 'src/profiles/dto/update.profile.dto';



@Controller('/api/admin/users')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) { }

  @UseGuards(AuthGuardIsAdmin)
  @Get('')
  @UseInterceptors(UserInterceptor)
  findAll(
    @Query('page', new PaginationValidation({ key: "page", isOptional: true, defaultValue: 1 })) page: number,
    @Query('limit', new PaginationValidation({ key: "limit", isOptional: true, defaultValue: 10, max: 50 })) limit: number,
  ) {
    return this.usersAdminService.findAll(page, limit)
  }

  //  ? Find user by id
  // @UseGuards(AuthGuardIsAdmin)
  // @Get('id/:id')
  // @UseInterceptors(UserInterceptor)
  // findById(@Param('id', new CustomParseIntPipe({ key: 'id', })) id: number) {
  //   return this.usersAdminService.findById(id)
  // }

  // ? Find user by username
  @UseGuards(AuthGuardIsAdmin)
  @Get('username/:username')
  @UseInterceptors(UserInterceptor)
  findByUsername(@Param('username',) username: string) {
    return this.usersAdminService.findByUsername(username)
  }

  // ? Find user by mobile
  @UseGuards(AuthGuardIsAdmin)
  @Get('mobile/:mobile')
  @UseInterceptors(UserInterceptor)
  findByMobile(@Param('mobile',) mobile: string) {
    return this.usersAdminService.findByMobile(mobile)
  }


  @UseGuards(AuthGuardIsAdmin)
  @Get('profile')
  @UseInterceptors(UserInterceptor)
  getProfile(
    @Req() request: Request
  ) {
    const userPayload: authPayload = request['user']
    return this.usersAdminService.getProfile(userPayload)
  }

  @UseGuards(AuthGuardIsAdmin)
  @Patch('profile')
  @UseInterceptors(UserInterceptor)
  editProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() request: Request,
  ) {
    const userPayload: authPayload = request['user']
    return this.usersAdminService.updateProfile(userPayload, updateProfileDto)
  }
}
