import { Body, Controller, Get, Patch, Post, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserInterceptor } from '../interceptors/users.interceptor';
import { CreateUserDto } from '../dto/create.user.dto';
import { Request } from 'express';
import { authPayload } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateProfileDto } from 'src/profiles/dto/update.profile.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @UseInterceptors(UserInterceptor)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  @UseInterceptors(UserInterceptor)
  getProfile(
    @Req() request: Request
  ) {
    const userPayload: authPayload = request['user']
    return this.usersService.getProfile(userPayload)
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  @UseInterceptors(UserInterceptor)
  editProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() request: Request,
  ) {
    const userPayload: authPayload = request['user']
    return this.usersService.updateProfile(userPayload, updateProfileDto)
  }

}
